import { Request, Response, NextFunction } from 'express';
import { AppError } from '@shared/errors/AppError';

export function transformFilesToImageNames(
  req: Request,
  res: Response,
  next: NextFunction
) {
  if (!req.files) {
    return next();
  }

  if (!Array.isArray(req.files)) {
    return next(new AppError('Formato de arquivos inesperado.', 400));
  }

  const images = req.files as Express.Multer.File[];
  const fileNames = images.map((file) => file.filename);

  req.fileNames = fileNames;

  next();
}
