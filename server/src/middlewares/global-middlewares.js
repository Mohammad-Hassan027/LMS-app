import express from 'express';
import cors from 'cors';
import { clerkMiddleware } from '@clerk/express';
import helmet from 'helmet';
import morgan from 'morgan';
import mongoSanitize from 'express-mongo-sanitize';

export function middleware(app) {
  app.use(helmet());
  app.use(morgan('combined'));
  app.use(
    cors({
      origin: process.env.CORS_ORIGIN || 'http://localhost:5173',
      credentials: true,
    })
  );
  app.use(express.json({ limit: '16kb' }));
  app.use(express.urlencoded({ extended: true, limit: '16kb' }));

  // app.use(mongoSanitize());

  app.use(
    clerkMiddleware({
      authorizedParties: [process.env.CLERK_FRONTEND_API],
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    })
  );
}
