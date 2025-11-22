import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

const UNPROCESSABLE_ENTITY_STATUS_CODE = 422 as const;

export function ensureFileSizeLimit(
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction
): Response {
  if (error instanceof MulterError && error.code === 'LIMIT_FILE_SIZE') {
    return res.status(UNPROCESSABLE_ENTITY_STATUS_CODE).json({
      status: 'error',
      message: 'Arquivo excede o limite permitido.',
    });
  }

  next(error);
}
