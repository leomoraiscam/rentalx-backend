import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateRentalUseCase } from './CreateRentalUseCase';

export class CreateRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { expectedReturnDate, carId } = request.body;
    const { id: userId } = request.user;

    const createRentalUseCase = container.resolve(CreateRentalUseCase);
    const rental = await createRentalUseCase.execute({
      carId,
      userId,
      expectedReturnDate,
    });

    return response.status(201).json(rental);
  }
}
