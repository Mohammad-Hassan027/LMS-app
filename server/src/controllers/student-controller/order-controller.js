import {
  ApiError as PaypalHttpError,
  CheckoutPaymentIntent,
  Client,
  Environment,
  LogLevel,
  OrdersController,
} from '@paypal/paypal-server-sdk';

import Order from '../../models/Order.js';
import Course from '../../models/Course.js';
import StudentCourses from '../../models/StudentCourses.js';
import { ApiError } from '../../utils/ApiError.js';
import { ApiResponse } from '../../utils/ApiResponse.js';
import { asyncHandler } from '../../utils/asyncHandler.js';
import { validateId } from '../../utils/validateId.js';
import { getAuth } from '@clerk/express';

const { PAYPAL_CLIENT_ID, PAYPAL_CLIENT_SECRET } = process.env;

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
  const orderID = validateId(req.params.orderID, 'PayPal Order ID'); // This is the PayPal Order ID

  // 1. Capture Payment
  const { jsonResponse, httpStatusCode } = await capturePayPalOrder(orderID);

  // 2. Check if the payment was actually completed
  if (jsonResponse.status === 'COMPLETED') {
    // 3. Find the pending order in your DB
    const order = await Order.findOne({ paymentId: orderID });

    if (!order) {
      throw new ApiError(404, 'Order not found');
    }

    // 4. Update Order Status
    order.paymentStatus = 'paid';
    order.orderStatus = 'confirmed';
    order.payerId = jsonResponse.payer?.payer_id || 'N/A';

    await order.save();

    // 5. Update Student Courses
    const studentCourses = await StudentCourses.findOne({
      userId: order.userId,
    });

    const courseData = {
      courseId: order.courseId,
      title: order.courseTitle,
      instructorId: order.instructorId,
      instructorName: order.instructorName,
      dateOfPurchase: order.orderDate,
      courseImage: order.courseImage,
    };

    if (studentCourses) {
      studentCourses.courses.push(courseData);
      await studentCourses.save();
    } else {
      const newStudentCourses = new StudentCourses({
        userId: order.userId,
        courses: [courseData],
      });
      await newStudentCourses.save();
    }

    // 6. Update Course Schema
    await Course.findByIdAndUpdate(order.courseId, {
      $addToSet: {
        students: {
          studentId: order.userId,
          studentName: order.userName,
          studentEmail: order.userEmail,
          paidAmount: order.coursePricing,
        },
      },
    });

    // 7. Success Response
    res
      .status(200)
      .json(
        new ApiResponse(200, order, 'Order confirmed and payment captured')
      );
  } else {
    // Payment not completed
    res
      .status(httpStatusCode)
      .json(
        new ApiResponse(
          httpStatusCode,
          jsonResponse,
          'Payment was not completed'
        )
      );
  }
});
