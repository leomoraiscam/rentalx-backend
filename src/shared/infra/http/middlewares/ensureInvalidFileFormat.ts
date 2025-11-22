import { Request, Response, NextFunction } from 'express';
import multer, { MulterError } from 'multer';

const BAD_REQUEST_STATUS_CODE = 400 as const;

export function ensureInvalidFileFormat(
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction
): Response {
  if (
    error instanceof MulterError &&
    error.code === ('INVALID_FORMAT_FILE' as multer.ErrorCode)
  ) {
    return res
      .status(BAD_REQUEST_STATUS_CODE)
      .json({ status: 'error', message: 'Formato do arquivo Invalido' });
  }

  next(error);
}
