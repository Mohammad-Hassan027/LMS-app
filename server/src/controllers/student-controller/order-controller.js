import {
  ApiError as PaypalHttpError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from '@paypal/paypal-server-sdk';
import { transporter } from '../../utils/emailTransporter.js';

import Order from '../../models/Order.js';
import Course from '../../models/Course.js';
import StudentCourses from '../../models/StudentCourses.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateId } from '../../utils/validateId.js';
import { getAuth } from '@clerk/express';
import mongoose from 'mongoose';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET, GMAIL_USER } = process.env;

const client = new Client({
  clientCredentialsAuthCredentials: {
    oAuthClientId: PAYPAL_CLIENT_ID,
    oAuthClientSecret: PAYPAL_CLIENT_SECRET,
  },
  timeout: 0,
  environment: Environment.Sandbox,
  logging: {
    logLevel: LogLevel.Info,
    logRequest: { logBody: true },
    logResponse: { logHeaders: true },
  },
});

const ordersController = new OrdersController(client);

const createPayPalOrder = async (cart) => {
  const collect = {
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: 'USD',
            value: Number(cart.coursePricing).toFixed(2),
            breakdown: {
              itemTotal: {
                currencyCode: 'USD',
                value: Number(cart.coursePricing).toFixed(2),
              },
            },
          },
          description: cart.courseTitle,
          customId: cart.userId,
        },
      ],
    },
    prefer: 'return=minimal',
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.createOrder(collect);
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof PaypalHttpError) {
      throw new ApiError(error.statusCode || 500, error.message);
    }
    throw new ApiError(500, 'Error communicating with PayPal');
  }
};

const capturePayPalOrder = async (orderID) => {
  const collect = {
    id: orderID,
    prefer: 'return=minimal',
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.captureOrder(collect);
    return {
      jsonResponse: JSON.parse(body),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof PaypalHttpError) {
      throw new ApiError(error.statusCode || 500, error.message);
    }
    throw new ApiError(500, 'Error capturing PayPal order');
  }
};

export const createOrder = asyncHandler(async (req, res) => {
  const { userId: authUserId } = getAuth(req);
  const {
    userId,
    userName,
    userEmail,
    orderStatus,
    paymentMethod,
    paymentStatus,
    orderDate,
    instructorId,
    instructorName,
    courseImage,
    courseTitle,
    courseId,
    coursePricing,
  } = req.body;

  validateId(userId, 'User ID');
  validateId(courseId, 'Course ID');

  if (authUserId !== userId) {
    throw new ApiError(403, 'You are not authorized to view these courses.');
  }

  // 1. Call PayPal
  const { jsonResponse, httpStatusCode } = await createPayPalOrder({
    coursePricing,
    courseTitle,
    userId,
    courseId,
  });

  if (httpStatusCode !== 201) {
    throw new ApiError(500, 'Failed to create order with PayPal');
  }

  // 2. Save Pending Order to DB
  const newlyCreatedCourseOrder = new Order({
    userId,
    userName,
    userEmail,
    orderStatus: 'pending',
    paymentMethod: 'paypal',
    paymentStatus: 'pending',
    orderDate: new Date(),
    paymentId: jsonResponse.id, // PayPal Order ID
    instructorId,
    instructorName,
    courseImage,
    courseTitle,
    courseId,
    coursePricing,
  });

  await newlyCreatedCourseOrder.save();

  // 3. Return Standard Response
  res.status(201).json(
    new ApiResponse(
      201,
      {
        ...jsonResponse,
        orderId: newlyCreatedCourseOrder._id, // Internal DB ID
      },
      'Order created successfully'
    )
  );
});

export const captureOrder = asyncHandler(async (req, res) => {
  const { paymentId } = req.params;

  if (!paymentId) {
    throw new ApiError(400, 'Payment ID is required');
  }

  // 1. Idempotency Check: Prevent double-processing
  const existingOrder = await Order.findOne({ paymentId });
  if (existingOrder && existingOrder.paymentStatus === 'paid') {
    return res
      .status(200)
      .json(new ApiResponse(200, existingOrder, 'Order already confirmed'));
  }

  // 2. Call PayPal to capture the payment
  const { jsonResponse, httpStatusCode } = await capturePayPalOrder(paymentId);

  if (!jsonResponse) {
    throw new ApiError(500, 'Empty response from PayPal');
  }

  const { status } = jsonResponse;

  // 3. Start Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    const order = await Order.findOne({ paymentId }).session(session);
    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // --- CASE A: PAYMENT COMPLETED (Money Received) ---
    if (status === 'COMPLETED') {
      // 1. Update Order
      order.paymentStatus = 'paid';
      order.orderStatus = 'confirmed';
      order.payerId = jsonResponse?.payer?.payer_id || 'Guest_User';
      await order.save({ session });

      // 2. Update Student Courses (Enrollment)
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

      // 3. Update Course Schema (Add Student)
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

      await session.commitTransaction();

      // SEND EMAIL (After transaction commits)
      try {
        await transporter.sendMail({
          from: '"PathOS Team" <' + GMAIL_USER + '>',
          to: order.userEmail,
          subject: 'Order Confirmation - PathOS',
          html: `
            <h1>Thank you for your purchase, ${order.userName}!</h1>
            <p>You have successfully enrolled in <strong>${order.courseTitle}</strong>.</p>
            <p><strong>Order ID:</strong> ${order._id}</p>
            <p><strong>Amount Paid:</strong> $${order.coursePricing}</p>
            <br/>
            <a href="https://your-frontend-url.com/student/courses">Go to your Dashboard</a>
          `,
        });
      } catch (emailError) {
        // Log the error but DO NOT fail the request, as the order is already saved
        console.error('Failed to send order confirmation email:', emailError);
      }

      return res
        .status(200)
        .json(
          new ApiResponse(200, order, 'Order confirmed and payment captured')
        );
    }

    // --- CASE B: PAYMENT PENDING ---
    else if (status === 'PENDING') {
      order.paymentStatus = 'pending_approval';
      order.orderStatus = 'pending';
      order.payerId = jsonResponse?.payer?.payer_id || 'Guest_User';

      await order.save({ session });
      await session.commitTransaction();

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            order,
            'Payment is pending approval. You will be enrolled once the payment clears.'
          )
        );
    }

    // --- CASE C: FAILED OR OTHER ---
    else {
      await session.abortTransaction();
      return res
        .status(httpStatusCode)
        .json(
          new ApiResponse(
            httpStatusCode,
            jsonResponse,
            'Payment failed or was cancelled'
          )
        );
    }
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
