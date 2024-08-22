import 'reflect-metadata';
import { errors } from 'celebrate';
import cors from 'cors';
import express, { Response, Request, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';

import 'dotenv';
import * as Sentry from '@sentry/node';
import * as Tracing from '@sentry/tracing';

import 'express-async-errors';

import '../../container';

import { multerConfig } from '@config/upload';
import { AppError } from '@shared/errors/AppError';

import swaggerFile from '../../../swagger.json';
import createConnection from '../typeorm';
import rateLimiter from './middlewares/rateLimiter';
import { router } from './routes';

createConnection();
const app = express();

app.use(rateLimiter);
Sentry.init({
  dsn: process.env.SENTRY_DSN,
  integrations: [
    new Sentry.Integrations.Http({ tracing: true }),
    new Tracing.Integrations.Express({ app }),
  ],
  tracesSampleRate: 1.0,
});
app.use(Sentry.Handlers.requestHandler());
app.use(Sentry.Handlers.tracingHandler());
app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use('/avatar', express.static(`${multerConfig.tmpFolder}/avatar`));
app.use('/car', express.static(`${multerConfig.tmpFolder}/cars`));
app.use(cors());
app.use(router);
app.use(errors());
app.use(Sentry.Handlers.errorHandler());
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    console.log(`Error: ${err}`);

    return response.status(500).json({
      status: 'error',
      message: `Internal Server Error - ${err.message || err} `,
    });
  }
);

export default app;
