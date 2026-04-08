import { Request, Response, NextFunction } from 'express';
import { MulterError } from 'multer';

interface IErrorResponse {
  status: number;
  message: string;
}

const uploadErrorsMap: Record<string, IErrorResponse> = {
  LIMIT_FILE_SIZE: {
    status: 422,
    message: 'O arquivo excede o tamanho limite permitido.',
  },
  INVALID_FORMAT_FILE: {
    status: 422,
    message: 'Formato de arquivo não suportado.',
  },
  LIMIT_UNEXPECTED_FILE: {
    status: 400,
    message: 'Campo de upload incorreto ou arquivo não esperado.',
  },
  LIMIT_PART_COUNT: {
    status: 400,
    message: 'Limite de partes da requisição excedido.',
  },
};

export function handleUploadErrors(
  error: Error,
  _: Request,
  res: Response,
  next: NextFunction
): Response | void {
  if (error instanceof MulterError) {
    const handler = uploadErrorsMap[error.code];

    if (handler) {
      return res.status(handler.status).json({
        status: 'error',
        message: handler.message,
      });
    }

    return res.status(400).json({
      status: 'error',
      message: error.message || 'Falha no upload do arquivo.',
    });
  }

  return next(error);
}
