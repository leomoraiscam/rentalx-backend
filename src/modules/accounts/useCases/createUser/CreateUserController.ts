import { plainToClass } from 'class-transformer';
import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { User } from '@modules/accounts/infra/typeorm/entities/User';

import { CreateUserUseCase } from './CreateUserUseCase';

export class CreateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, email, password, driverLicense } = request.body;

    const createUserUseCase = container.resolve(CreateUserUseCase);
    const user = await createUserUseCase.execute({
      name,
      email,
      password,
      driverLicense,
    });

    const userInstance = plainToClass(User, user);

    return response.status(201).json(userInstance);
  }
}
