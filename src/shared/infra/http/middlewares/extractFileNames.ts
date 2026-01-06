import { Request, Response, NextFunction } from 'express';

export function extractFileNames(
  req: Request,
  _: Response,
  next: NextFunction
): void {
  let files: Express.Multer.File[] = [];

  if (req.file) {
    files.push(req.file);
  }

  if (req.files && Array.isArray(req.files)) {
    files = [...files, ...req.files];
  }

  req.fileNames = files.map((file) => file.filename);

  next();
}
