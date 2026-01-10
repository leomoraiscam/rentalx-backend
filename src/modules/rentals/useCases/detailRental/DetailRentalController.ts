import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { DetailRentalUseCase } from './DetailRentalUseCase';

export class DetailRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const detailRentalUseCase = container.resolve(DetailRentalUseCase);
    const rental = await detailRentalUseCase.execute(id);

    return response.status(200).json(rental);
  }
}
