import { Request, Response, NextFunction } from 'express';
import { verify } from 'jsonwebtoken';

import { auth } from '@config/auth';
import { UserRepository } from '@modules/accounts/infra/typeorm/repositories/UserRepository';
import { UserTokenRepository } from '@modules/accounts/infra/typeorm/repositories/UserTokenRepository';
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

  const userTokenRepository = new UserTokenRepository();

  if (!authHeader) {
    throw new AppError('Token missing', 401);
  }

  const [, token] = authHeader.split(' ');

  try {
    const { sub: userId } = verify(token, auth.secretRefreshToken) as IPayload;

    const user = await userTokenRepository.findByUserIdAndRefreshToken({
      refreshToken: token,
      userId,
    });

    if (!user) {
      throw new AppError('User does not exist!', 401);
    }

    request.user = {
      id: userId,
    };

    next();
  } catch (error) {
    throw new AppError('Invalid token!', 401);
  }
}
