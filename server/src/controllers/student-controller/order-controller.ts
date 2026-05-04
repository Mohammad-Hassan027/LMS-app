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

const createPayPalOrder = async (orderData: any) => {
  const collect = {
    body: {
      intent: CheckoutPaymentIntent.Capture,
      purchaseUnits: [
        {
          amount: {
            currencyCode: 'USD',
            value: Number(orderData.totalAmount).toFixed(2),
            breakdown: {
              itemTotal: {
                currencyCode: 'USD',
                value: Number(orderData.totalAmount).toFixed(2),
              },
            },
          },
          description: orderData.description,
          customId: orderData.userId,
        },
      ],
    },
    prefer: 'return=minimal',
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.createOrder(collect);
    return {
      jsonResponse: JSON.parse(body as string),
      httpStatusCode: httpResponse.statusCode,
    };
  } catch (error) {
    if (error instanceof PaypalHttpError) {
      throw new ApiError(error.statusCode || 500, error.message);
    }
    throw new ApiError(500, 'Error communicating with PayPal');
  }
};

const capturePayPalOrder = async (orderID: string) => {
  const collect = {
    id: orderID,
    prefer: 'return=minimal',
  };

  try {
    const { body, ...httpResponse } =
      await ordersController.captureOrder(collect);
    return {
      jsonResponse: JSON.parse(body as string),
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
    cartItems,
  } = req.body;

  validateId(userId, 'User ID');

  if (authUserId !== userId) {
    throw new ApiError(403, 'You are not authorized to create orders.');
  }

  const isBulkOrder = Array.isArray(cartItems) && cartItems.length > 0;
  let totalAmount = 0;
  let description = '';

  // 1. Calculate Total Amount
  if (isBulkOrder) {
    totalAmount = cartItems.reduce(
      (acc, item) =>
        acc + Number(item.pricing || item.price || item.coursePricing || 0),
      0
    );
    description = `Checkout - ${cartItems.length} Courses`;
  } else {
    validateId(courseId, 'Course ID');
    totalAmount = Number(coursePricing || 0);
    description = courseTitle;
  }

  // Debug Log to ensure price is calculated
  console.log('Creating Order. Total Amount:', totalAmount);

  let jsonResponse = {};

  // 2. Call PayPal ONLY if price > 0
  if (totalAmount > 0) {
    const paypalResult = await createPayPalOrder({
      totalAmount,
      description,
      userId,
    });

    if (paypalResult.httpStatusCode !== 201) {
      throw new ApiError(500, 'Failed to create order with PayPal');
    }
    jsonResponse = paypalResult.jsonResponse;
  } else {
    // FREE COURSE LOGIC: Bypass PayPal
    jsonResponse = {
      id: `FREE_${new Date().getTime()}_${userId.slice(-5)}`,
      status: 'COMPLETED',
      isFree: true,
    };
  }

  // 3. Save Orders to DB
  const orderDocuments = [];
  // If free, mark as paid/confirmed immediately
  const initialStatus = totalAmount > 0 ? 'pending' : 'confirmed';
  const initialPaymentStatus = totalAmount > 0 ? 'pending' : 'paid';

  if (isBulkOrder) {
    cartItems.forEach((item) => {
      orderDocuments.push({
        userId,
        userName,
        userEmail,
        orderStatus: initialStatus,
        paymentMethod: 'paypal',
        paymentStatus: initialPaymentStatus,
        orderDate: new Date(),
        paymentId: jsonResponse.id,
        instructorId: item.instructorId,
        instructorName: item.instructorName,
        courseImage: item.image,
        courseTitle: item.title,
        courseId: item._id || item.courseId || item.id,
        coursePricing: item.pricing,
      });
    });
  } else {
    orderDocuments.push({
      userId,
      userName,
      userEmail,
      orderStatus: initialStatus,
      paymentMethod: 'paypal',
      paymentStatus: initialPaymentStatus,
      orderDate: new Date(),
      paymentId: jsonResponse.id,
      instructorId,
      instructorName,
      courseImage,
      courseTitle,
      courseId,
      coursePricing: totalAmount,
    });
  }

  // Save to DB
  const savedOrders = await Order.insertMany(orderDocuments);

  // 4. Handle Immediate Enrollment for Free Courses
  if (totalAmount === 0) {
    const session = await mongoose.startSession();
    session.startTransaction();
    try {
      for (const order of savedOrders) {
        // A. Update Student Enrollment
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

        // B. Update Course Student List
        await Course.findByIdAndUpdate(
          order.courseId,
          {
            $addToSet: {
              students: {
                studentId: order.userId,
                studentName: order.userName,
                studentEmail: order.userEmail,
                paidAmount: 0,
              },
            },
          },
          { session }
        );
      }
      await session.commitTransaction();
    } catch (err) {
      await session.abortTransaction();
      console.error('Error enrolling in free course:', err);
      // Even if enrollment update fails, we return success so user sees order created
    } finally {
      session.endSession();
    }
  }

  // 5. Return Response
  res.status(201).json(
    new ApiResponse(
      201,
      {
        ...jsonResponse,
        isBulk: isBulkOrder,
        isFree: totalAmount === 0,
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

  // 1. Find ALL orders associated with this payment ID
  const orders = await Order.find({ paymentId });

  if (!orders || orders.length === 0) {
    throw new ApiError(404, 'Order not found');
  }

  // Idempotency check: if the first order is already paid, assume all are
  if (orders[0].paymentStatus === 'paid') {
    return res
      .status(200)
      .json(new ApiResponse(200, { success: true }, 'Order already confirmed'));
  }

  // 2. Call PayPal to capture
  const { jsonResponse, httpStatusCode } = await capturePayPalOrder(paymentId);

  if (!jsonResponse) {
    throw new ApiError(500, 'Empty response from PayPal');
  }

  const { status } = jsonResponse;

  // 3. Start Transaction
  const session = await mongoose.startSession();
  session.startTransaction();

  try {
    // Re-fetch orders inside session to ensure lock/consistency
    const currentOrders = await Order.find({ paymentId }).session(session);

    if (status === 'COMPLETED') {
      const payerId = jsonResponse?.payer?.payer_id || 'Guest_User';

      for (const order of currentOrders) {
        // A. Update Order Status
        order.paymentStatus = 'paid';
        order.orderStatus = 'confirmed';
        order.payerId = payerId;
        await order.save({ session });

        // B. Update Student Enrollment
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

        // C. Update Course Student List
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
      }

      await session.commitTransaction();

      const coursesListHtml = currentOrders
        .map((o) => `<li>${o.courseTitle} - $${o.coursePricing}</li>`)
        .join('');

      const totalPaid = currentOrders
        .reduce((acc, o) => acc + Number(o.coursePricing), 0)
        .toFixed(2);

      try {
        await transporter.sendMail({
          from: '"PathOS Team" <' + GMAIL_USER + '>',
          to: currentOrders[0].userEmail,
          subject: 'Order Confirmation - PathOS',
          html: `
            <h1>Thank you for your purchase, ${currentOrders[0].userName}!</h1>
            <p>You have successfully enrolled in the following courses:</p>
            <ul>${coursesListHtml}</ul>
            <p><strong>Total Paid:</strong> $${totalPaid}</p>
            <br/>
            <a href="https://path-os.vercel.app/my-courses">Go to your Dashboard</a>
          `,
        });
      } catch (emailError) {
        console.error('Failed to send order confirmation email:', emailError);
      }

      return res
        .status(200)
        .json(
          new ApiResponse(
            200,
            { success: true },
            'Orders confirmed and payment captured'
          )
        );
    } else if (status === 'PENDING') {
      // Mark all as pending approval
      for (const order of currentOrders) {
        order.paymentStatus = 'pending_approval';
        order.orderStatus = 'pending';
        order.payerId = jsonResponse?.payer?.payer_id || 'Guest_User';
        await order.save({ session });
      }

      await session.commitTransaction();
      return res
        .status(200)
        .json(new ApiResponse(200, null, 'Payment pending approval'));
    } else {
      await session.abortTransaction();
      return res
        .status(httpStatusCode)
        .json(new ApiResponse(httpStatusCode, jsonResponse, 'Payment failed'));
    }
  } catch (error) {
    await session.abortTransaction();
    throw error;
  } finally {
    session.endSession();
  }
});
