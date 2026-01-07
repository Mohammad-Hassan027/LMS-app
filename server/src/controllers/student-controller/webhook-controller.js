import mongoose from 'mongoose';
import Order from '../../models/Order.js';
import StudentCourses from '../../models/StudentCourses.js';
import Course from '../../models/Course.js';
import { verifyPayPalSignature } from './../../utils/paypalVerification';

// Helper function to finalize enrollment (Dry logic)
const finalizeEnrollment = async (orderId, paymentId, payerId, session) => {
  const order = await Order.findById(orderId).session(session);

  if (!order) throw new Error('Order not found');
  if (order.paymentStatus === 'paid') return; // Already processed

  // 1. Update Order Status
  order.paymentStatus = 'paid';
  order.orderStatus = 'confirmed';
  order.payerId = payerId || 'Guest_User';
  await order.save({ session });

  // 2. Update Student Courses
  await StudentCourses.findOneAndUpdate(
    { userId: order.userId },
    {
      $push: {
        courses: {
          courseId: order.courseId,
          title: order.courseTitle,
          instructorId: order.instructorId,
          instructorName: order.instructorName,
          dateOfPurchase: order.orderDate,
          courseImage: order.courseImage,
        },
      },
    },
    { upsert: true, new: true, session }
  );

  // 3. Update Course Schema
  await Course.findByIdAndUpdate(
    order.courseId,
    {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    },
    { session }
  );
};

export const handlePayPalWebhook = async (req, res) => {
  // In production, you MUST verify the webhook signature here to ensure
  // the request actually came from PayPal.
  // const isValid = await verifyPayPalSignature(req);
  // if (!isValid) return res.status(400).send('Invalid Signature');

  const isValid = await verifyPayPalSignature(req);

  if (!isValid) {
    console.error('⚠️ Security Warning: Fake PayPal Webhook detected!');
    return res.status(400).send('Invalid Signature');
  }

  const event = req.body;
  const eventType = event.event_type;
  const resource = event.resource; // The Capture Object

  if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // PayPal Webhooks usually provide the Order ID in supplementary data
      // OR we can search by the PayPal Order ID associated with this Capture
      // Note: resource.supplementary_data.related_ids.order_id often holds the Order ID

      const paypalOrderId = resource.supplementary_data?.related_ids?.order_id;

      if (!paypalOrderId) {
        // Fallback/Log error
        return res.status(200).send();
      }

      // Find our DB Order using the PayPal Order ID
      const order = await Order.findOne({ paymentId: paypalOrderId }).session(
        session
      );

      if (order) {
        await finalizeEnrollment(
          order._id,
          paypalOrderId,
          resource.payer?.payer_id,
          session
        );
        await session.commitTransaction();
      } else {
        await session.abortTransaction();
      }
    } catch (error) {
      console.error('Webhook Error:', error);
      await session.abortTransaction();
      // Still return 200 to PayPal so they don't keep retrying infinitely
      return res.status(200).send();
    } finally {
      session.endSession();
    }
  }

  // Acknowledge receipt to PayPal
  res.status(200).send();
};
