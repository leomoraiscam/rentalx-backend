import { Request, Response, NextFunction } from 'express';
import multer from 'multer';

export interface ISingleUploadOptions {
  fieldName: string;
}

export interface IArrayUploadOptions {
  fieldName: string;
  maxCount?: number;
}

export interface IFieldsUploadOptions {
  fields: multer.Field[];
}

const BAD_REQUEST_STATUS_CODE = 400 as const;

function handleUploadError(err: unknown, res: Response, next: NextFunction) {
  if (err) {
    if (err instanceof multer.MulterError) {
      if (err.code === 'LIMIT_UNEXPECTED_FILE') {
        return res
          .status(BAD_REQUEST_STATUS_CODE)
          .json({ status: 'error', message: 'Fieldname do upload inválido' });
      }
    }
  }

  next(err);
}

export function ensureSingleUpload(
  upload: multer.Multer,
  options: ISingleUploadOptions
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const handler = upload.single(options.fieldName);
    handler(req, res, (err: unknown) => handleUploadError(err, res, next));
  };
}

export function ensureArrayUpload(
  upload: multer.Multer,
  options: IArrayUploadOptions
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const handler = upload.array(options.fieldName, options.maxCount);
    handler(req, res, (err: unknown) => handleUploadError(err, res, next));
  };
}

export function ensureFieldsUpload(
  upload: multer.Multer,
  options: IFieldsUploadOptions
) {
  return (req: Request, res: Response, next: NextFunction): void => {
    const handler = upload.fields(options.fields);
    handler(req, res, (err: unknown) => handleUploadError(err, res, next));
  };
}
