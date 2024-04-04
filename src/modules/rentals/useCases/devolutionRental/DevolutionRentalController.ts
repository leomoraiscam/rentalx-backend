import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DevolutionRentalUseCase } from './DevolutionRentalUseCase';

export class DevolutionRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id: userId } = request.user;
    const { id } = request.params;

    const devolutionRentalUseCase = container.resolve(DevolutionRentalUseCase);
    const rental = await devolutionRentalUseCase.execute({
      id,
      userId,
    });

    return response.status(201).json(rental);
  }
}
