import rateLimit from 'express-rate-limit';

type RateLimiterOptions = {
  windowMs: number;
  max: number;
  message: {
    error: string;
    retryAfter: string;
  };
};

const createRateLimiter = (options: RateLimiterOptions) => {
  return rateLimit({
    windowMs: options.windowMs,
    max: options.max,
    message: options.message,
    standardHeaders: true,
    legacyHeaders: false,
  });
};

export const globalRateLimiter = createRateLimiter({
  windowMs: 15 * 60 * 1000,
  max: 100,
  message: {
    error: 'Too many requests from this IP address',
    retryAfter: '15 minutes',
  },
});

export const paymentRateLimiter = createRateLimiter({
  windowMs: 1 * 60 * 60 * 1000,
  max: 5,
  message: {
    error: 'Too many requests from this IP address',
    retryAfter: '1 hour',
  },
});
