import { Request, Response, NextFunction } from 'express';

const BAD_REQUEST_STATUS_CODE = 400 as const;

export function requireFile(
  req: Request,
  res: Response,
  next: NextFunction
): Response | void {
  const hasFile = req.file || (req.files && Object.keys(req.files).length > 0);

  if (!hasFile) {
    return res.status(BAD_REQUEST_STATUS_CODE).json({
      status: 'error',
      message: 'O campo de arquivo é obrigatório.',
    });
  }

  return next();
}
