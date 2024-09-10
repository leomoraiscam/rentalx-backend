import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListRentalsUseCase } from './ListRentalsUseCase';

export class ListRentalsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const listRentalsUseCase = container.resolve(ListRentalsUseCase);
    const rentals = await listRentalsUseCase.execute({
      ...request.query,
    });

    return response.status(200).json(rentals);
  }
}
