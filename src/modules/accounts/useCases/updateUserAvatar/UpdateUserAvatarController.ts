import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateUserAvatarUseCase } from './UpdateUserAvatarUseCase';

export class UpdateUserAvatarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const imageFileName = request.file.filename;
    const updateUserAvatarUseCase = container.resolve(UpdateUserAvatarUseCase);
    const updatedUser = await updateUserAvatarUseCase.execute({
      userId,
      avatar: imageFileName,
    });

    return response.status(200).json(updatedUser);
  }
}
