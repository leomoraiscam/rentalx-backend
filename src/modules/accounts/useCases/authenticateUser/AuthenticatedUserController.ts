import { Request, Response } from 'express';
import { container } from 'tsyringe';

import AuthenticatedUserUseCase from './AuthenticatedUserUseCase';

class AuthenticatedUserController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { email, password } = request.body;

    const authenticatedUserUseCase = container.resolve(
      AuthenticatedUserUseCase
    );

    const token = await authenticatedUserUseCase.execute({
      email,
      password,
    });

    return response.status(201).json(token);
  }
}

export default AuthenticatedUserController;
