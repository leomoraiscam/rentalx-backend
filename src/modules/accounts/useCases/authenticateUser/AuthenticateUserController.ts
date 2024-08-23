import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

export class AuthenticateUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;
    const authenticatedUserUseCase = container.resolve(AuthenticateUserUseCase);
    const authenticatedUser = await authenticatedUserUseCase.execute({
      email,
      password,
    });

    return response.status(200).json(authenticatedUser);
  }
}
