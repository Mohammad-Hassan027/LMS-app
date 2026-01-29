import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import helmet from 'helmet';
import morgan from 'morgan';
import connectDB from '../db/index.js';
import mongoSanitize from 'express-mongo-sanitize';

export function middleware(app) {
  // 1. CORS - MUST be the first middleware
  // This ensures the browser receives permission headers before any DB connection or logic occurs.
  app.use(
    cors({
      origin: (origin, callback) => {
        // Allow requests with no origin (like mobile apps, curl, or server-to-server)
        if (!origin) return callback(null, true);

        const allowedOrigins = [
          process.env.CLIENT_URL, // e.g. https://path-os.vercel.app
          'http://localhost:5173',
        ];

        // Allow allowed origins AND any Vercel preview URL
        if (allowedOrigins.includes(origin) || origin.endsWith('.vercel.app')) {
          callback(null, true);
        } else {
          console.log('Blocked by CORS:', origin);
          callback(new Error('Not allowed by CORS'));
        }
      },
      credentials: true,
      methods: ['GET', 'POST', 'PUT', 'DELETE', 'PATCH', 'OPTIONS'],
      allowedHeaders: [
        'Content-Type',
        'Authorization',
        'X-Requested-With',
        'device-remember-token',
        'Access-Control-Allow-Origin',
        'Origin',
        'Accept',
      ],
    })
  );

  // 2. Helmet - configured to allow cross-origin media
  // This allows your frontend to display images/videos hosted on this backend.
  app.use(
    helmet({
      crossOriginResourcePolicy: { policy: 'cross-origin' },
    })
  );

  app.use(morgan('combined'));

  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));


  // 4. Sanitize Input
  // app.use(mongoSanitize());

  // Database Connection
  app.use(async (req, res, next) => {
    try {
      await connectDB();
      next();
    } catch (error) {
      console.error('Database connection failed:', error);
      res.status(500).json({
        success: false,
        message: 'Database connection failed',
        error: error.message,
      });
    }
  });

  app.use(
    clerkMiddleware({
      authorizedParties: [
        process.env.CLIENT_URL,
        'https://path-os.vercel.app',
        'http://localhost:5173',
      ],
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    })
  );
}
