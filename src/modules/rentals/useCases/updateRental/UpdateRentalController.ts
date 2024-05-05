import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateRentalUseCase } from './UpdateRentalUseCase';

export class UpdateRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id, expectedReturnDate, carId, startDate } = request.body;

    const updateRentalUseCase = container.resolve(UpdateRentalUseCase);
    const updatedRental = await updateRentalUseCase.execute({
      id,
      startDate,
      expectedReturnDate,
      carId,
    });

    return response.status(200).json(updatedRental);
  }
}
