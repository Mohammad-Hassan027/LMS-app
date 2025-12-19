import express from 'express';
import cors from 'cors';
import cookieParser from 'cookie-parser';
import { clerkMiddleware } from '@clerk/express';

export function middleware(app) {
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

  app.use((err, req, res, next) => {
    console.log(err.stack);
    res.status(500).send('Something went wrong!');
  });
}
