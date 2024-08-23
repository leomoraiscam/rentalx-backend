import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { RefreshTokenUseCase } from './RefreshTokenUseCase';

export class RefreshTokenController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { token } = request.body;
    const refreshTokenUseCase = container.resolve(RefreshTokenUseCase);
    const refreshToken = await refreshTokenUseCase.execute(token);

    return response.status(201).json(refreshToken);
  }
}
