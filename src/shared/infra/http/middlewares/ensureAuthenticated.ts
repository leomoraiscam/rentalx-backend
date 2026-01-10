import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { auth } from '@config/auth'; // Onde estão seus segredos
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
}

export default async function ensureAuthenticated(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const authHeader = request.headers.authorization;

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(token, auth.secretToken) as IPayload;

    request.user = {
      id: userId,
    };

    next();
  } catch {
    throw new AppError('Invalid token!', 401);
  }
}
