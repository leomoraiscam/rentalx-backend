import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ShowSummaryDetailsOfRentalUseCase } from './ShowSummaryDetailsOfRentalUseCase';

export class ShowSummaryDetailsOfRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;

    const showSummaryDetailsOfRentalUseCase = container.resolve(
      ShowSummaryDetailsOfRentalUseCase
    );
    const rentals = await showSummaryDetailsOfRentalUseCase.execute(id);

    return response.status(200).json(rentals);
  }
}
