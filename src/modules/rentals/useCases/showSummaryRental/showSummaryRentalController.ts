import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ShowSummaryRentalUseCase } from './showSummaryRentalUseCase';

export class ShowSummaryRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showSummaryRentalUseCase = container.resolve(
      ShowSummaryRentalUseCase
    );
    const rentals = await showSummaryRentalUseCase.execute(id);

    return response.status(200).json(rentals);
  }
}
