import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ShowRentalUseCase } from './ShowRentalUseCase';

export class ShowRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const showRentalUseCase = container.resolve(ShowRentalUseCase);
    const rental = await showRentalUseCase.execute(id);

    return response.status(200).json(rental);
  }
}
