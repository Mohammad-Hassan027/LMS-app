import mongoose from 'mongoose';
import { Resend } from 'resend';
import Order from '../../models/Order.js';
import StudentCourses from '../../models/StudentCourses.js';
import Course from '../../models/Course.js';
import { verifyPayPalSignature } from './../../utils/paypalVerification.js';

const resend = new Resend(process.env.RESEND_API_KEY);

const finalizeEnrollment = async (orderId, paymentId, payerId, session) => {
  const order = await Order.findById(orderId).session(session);

  if (!order) throw new Error('Order not found');

  // Return false if already processed
  if (order.paymentStatus === 'paid') return false;

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

  // Return true to indicate we did the work
  return true;
};

export const handlePayPalWebhook = async (req, res) => {
  const isValid = await verifyPayPalSignature(req);

  if (!isValid) {
    console.error('⚠️ Security Warning: Fake PayPal Webhook detected!');
    return res.status(400).send('Invalid Signature');
  }

  const event = req.body;
  const eventType = event.event_type;
  const resource = event.resource;

  if (eventType === 'PAYMENT.CAPTURE.COMPLETED') {
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      const paypalOrderId = resource.supplementary_data?.related_ids?.order_id;

      if (!paypalOrderId) {
        return res.status(200).send();
      }

      const order = await Order.findOne({ paymentId: paypalOrderId }).session(
        session
      );

      if (order) {
        // Capture the return value (true/false)
        const isNewEnrollment = await finalizeEnrollment(
          order._id,
          paypalOrderId,
          resource.payer?.payer_id,
          session
        );

        await session.commitTransaction();

        // Only send email if this was a NEW enrollment
        if (isNewEnrollment) {
          try {
            await resend.emails.send({
              from: 'PathOS <onboarding@resend.dev>',
              to: order.userEmail,
              subject: 'Order Confirmation - PathOS',
              html: `
                <h1>Thank you for your purchase, ${order.userName}!</h1>
                <p>You have successfully enrolled in <strong>${order.courseTitle}</strong>.</p>
                <p><strong>Order ID:</strong> ${order._id}</p>
                <p><strong>Amount Paid:</strong> $${order.coursePricing}</p>
                <br/>
                <a href="https://path-os.vercel.app/my-courses">Go to your Dashboard</a>
              `,
            });
            console.log(`📧 Email sent to ${order.userEmail} via Webhook`);
          } catch (emailError) {
            console.error('❌ Failed to send email via Webhook:', emailError);
          }
        } else {
          console.log('ℹ️ Webhook received, but order was already processed.');
        }
      } else {
        await session.abortTransaction();
      }
    } catch (error) {
      console.error('Webhook Error:', error);
      await session.abortTransaction();
      return res.status(200).send();
    } finally {
      session.endSession();
    }
  }

  res.status(200).send();
};
