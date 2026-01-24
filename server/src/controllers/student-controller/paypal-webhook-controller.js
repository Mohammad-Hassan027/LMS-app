import mongoose from 'mongoose';
import Order from '../../models/Order.js';
import StudentCourses from '../../models/StudentCourses.js';
import Course from '../../models/Course.js';
import { verifyPayPalSignature } from '../../utils/paypalVerification.js';
import { transporter } from '../../utils/emailTransporter.js';

const { GMAIL_USER } = process.env;

const finalizeEnrollment = async (orderId, paymentId, payerId, session) => {
  const order = await Order.findById(orderId).session(session);

  if (!order) throw new Error('Order not found');

  // Return false if already processed (Idempotency check)
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
      $addToSet: {
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

      const orders = await Order.find({
        paymentId: { $eq: paypalOrderId },
      }).session(session);

      if (orders.length > 0) {
        const newlyEnrolledOrders = [];

        for (const order of orders) {
          const isNewEnrollment = await finalizeEnrollment(
            order._id,
            paypalOrderId,
            resource.payer?.payer_id,
            session
          );
          if (isNewEnrollment) {
            newlyEnrolledOrders.push(order);
          }
        }

        await session.commitTransaction();

        if (newlyEnrolledOrders.length > 0) {
          try {
            const isBulk = newlyEnrolledOrders.length > 1;
            const userEmail = newlyEnrolledOrders[0].userEmail;
            const userName = newlyEnrolledOrders[0].userName;
            const totalPaid = newlyEnrolledOrders
              .reduce((sum, o) => sum + Number(o.coursePricing), 0)
              .toFixed(2);

            let emailHtml = `<h1>Thank you for your purchase, ${userName}!</h1>`;

            if (isBulk) {
              const courseList = newlyEnrolledOrders
                .map((o) => `<li>${o.courseTitle} - $${o.coursePricing}</li>`)
                .join('');
              emailHtml += `
                  <p>You have successfully enrolled in the following courses:</p>
                  <ul>${courseList}</ul>
                  <p><strong>Total Amount Paid:</strong> $${totalPaid}</p>
              `;
            } else {
              const order = newlyEnrolledOrders[0];
              emailHtml += `
                  <p>You have successfully enrolled in <strong>${order.courseTitle}</strong>.</p>
                  <p><strong>Order ID:</strong> ${order._id}</p>
                  <p><strong>Amount Paid:</strong> $${order.coursePricing}</p>
              `;
            }

            emailHtml += `<br/><a href="https://path-os.vercel.app/my-courses">Go to your Dashboard</a>`;

            await transporter.sendMail({
              from: '"PathOS Team" <' + GMAIL_USER + '>',
              to: userEmail,
              subject: 'Order Confirmation - PathOS',
              html: emailHtml,
            });
            console.log(`📧 Email sent to ${userEmail} via Webhook`);
          } catch (emailError) {
            console.error('❌ Failed to send email via Webhook:', emailError);
          }
        } else {
          console.log(
            'ℹ️ Webhook received, but orders were already processed.'
          );
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
