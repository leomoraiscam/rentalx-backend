import { Request, Response } from 'express';
import { container } from 'tsyringe';

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

    return response.status(201).json(user);
  }
}
