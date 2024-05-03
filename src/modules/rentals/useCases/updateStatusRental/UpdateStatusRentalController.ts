import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { UpdateStatusRentalUseCase } from './UpdateStatusRentalUseCase';

export class UpdateStatusRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const updateStatusRentalUseCase = container.resolve(
      UpdateStatusRentalUseCase
    );
    const updatedRental = await updateStatusRentalUseCase.execute(id);

    return response.status(200).json(updatedRental);
  }
}
