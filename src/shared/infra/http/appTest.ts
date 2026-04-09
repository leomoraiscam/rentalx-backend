/* eslint-disable no-console */
/**
 * Versão do app sem auto-conexão ao banco.
 * Usada pelos testes E2E que gerenciam a própria conexão TypeORM.
 */
import 'reflect-metadata';
import { errors } from 'celebrate';
import cors from 'cors';
import express, { Response, Request, NextFunction } from 'express';

import 'dotenv/config';
import 'express-async-errors';

import '../../container';

import { TMP_FOLDER, setupUploadFolders } from '@config/upload';
import { AppError } from '@shared/errors/AppError';

import { router } from './routes';

const app = express();
setupUploadFolders();

app.use(express.json());
app.use('/avatar', express.static(`${TMP_FOLDER}/avatar`));
app.use('/car', express.static(`${TMP_FOLDER}/cars`));
app.use(cors({ origin: '*' }));
app.use(router);
app.use(errors());
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
