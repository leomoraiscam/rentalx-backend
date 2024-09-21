import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ResetPasswordUseCase } from './ResetPasswordUseCase';

export class ResetPasswordController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.query;
    const { password } = request.body;
    const resetPasswordUseCase = container.resolve(ResetPasswordUseCase);

    await resetPasswordUseCase.execute({
      token: token as string,
      password,
    });

    return response.status(200).send();
  }
}
