import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ConfirmRentalUseCase } from './ConfirmRentalUseCase';

export class ConfirmRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const confirmRentalUseCase = container.resolve(ConfirmRentalUseCase);
    const updatedRental = await confirmRentalUseCase.execute(id);

    return response.status(200).json(updatedRental);
  }
}
