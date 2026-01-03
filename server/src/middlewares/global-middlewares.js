import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { clerkMiddleware } from '@clerk/express';
import helmet from 'helmet';
import morgan from 'morgan';
import bodyParser from 'body-parser';

export function middleware(app) {
  app.use(bodyParser.json());
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
  app.use(express.static('public'));
  app.use(cookieParser());
  app.use(
    clerkMiddleware({
      authorizedParties: [process.env.CLERK_FRONTEND_API],
      secretKey: process.env.CLERK_SECRET_KEY,
      publishableKey: process.env.CLERK_PUBLISHABLE_KEY,
    })
  );
}
