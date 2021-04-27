import { Request, Response, NextFunction } from 'express';
import { RateLimiterRedis } from 'rate-limiter-flexible';
import redis from 'redis';

import AppError from '@shared/errors/AppError';

const redisClient = redis.createClient({
  host: process.env.NODE_ENV === 'test' ? 'localhost' : process.env.REDIS_HOST,
  port: Number(process.env.REDIS_PORT),
  password: process.env.REDIS_PASS || undefined,
});

const limiter = new RateLimiterRedis({
  storeClient: redisClient,
  keyPrefix: 'rateLimiter',
  points: 2,
  duration: 1,
});

export default async function reateLimiter(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  try {
    if (process.env.NODE_ENV !== 'test') {
      await limiter.consume(request.ip);
    }

    return next();
  } catch (error) {
    throw new AppError('To many requests', 429);
  }
}

export { redisClient };
