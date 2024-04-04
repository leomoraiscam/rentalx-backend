import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { User } from '@modules/accounts/infra/typeorm/entities/User';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

export class UpdateUserAvatarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const avatarFile = request.file.filename;

    const updateUserAvatarUseCase = container.resolve(UpdateUserAvatarUseCase);
    const updatedUser = await updateUserAvatarUseCase.execute({
      userId,
      avatarFile,
    });

    const userInstance = plainToClass(User, updatedUser);

    return response.status(200).json(userInstance);
  }
}
