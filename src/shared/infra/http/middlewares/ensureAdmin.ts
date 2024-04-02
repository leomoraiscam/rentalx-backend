import { Request, Response, NextFunction } from 'express';

import { UserRepository } from '@modules/accounts/infra/typeorm/repositories/UserRepository';
import AppError from '@shared/errors/AppError';

export default async function ensureAdmin(
  request: Request,
  response: Response,
  next: NextFunction
): Promise<void> {
  const { id } = request.user;

  const userRepository = new UserRepository();

  const user = await userRepository.findById(id);

  if (!user.isAdmin) {
    throw new AppError('Users isnt not admin!');
  }

  return next();
}
