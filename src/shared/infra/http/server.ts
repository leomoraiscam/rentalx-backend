import 'reflect-metadata';
import express, { Response, Request, NextFunction } from 'express';
import swaggerUi from 'swagger-ui-express';
import 'express-async-errors';

import '../../container';

import AppError from '@shared/errors/AppError';

import swaggerFile from '../../../swagger.json';
import createConnection from '../typeorm';
import routes from './routes';

createConnection();
const app = express();

app.use(express.json());
app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerFile));
app.use(routes);
app.use(
  (err: Error, request: Request, response: Response, next: NextFunction) => {
    if (err instanceof AppError) {
      return response.status(err.statusCode).json({
        status: 'error',
        message: err.message,
      });
    }

    return response.status(500).json({
      status: 'error',
      message: `Internal Server Error - ${err.message}`,
    });
  }
);

app.listen(3333, () => {
  console.log('🚀 Server is running');
});
