import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CancelRentalUseCase } from './CancelRentalUseCase';

export class CancelRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { id: userId } = request.user;
    const cancelRentalUseCase = container.resolve(CancelRentalUseCase);
    const updatedRental = await cancelRentalUseCase.execute(id, userId);

    return response.status(200).json(updatedRental);
  }
}

