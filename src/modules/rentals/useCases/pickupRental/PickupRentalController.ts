import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { PickupRentalUseCase } from './PickupRentalUseCase';

export class PickupRentalController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const pickupRentalUseCase = container.resolve(PickupRentalUseCase);

    await pickupRentalUseCase.execute(id);

    return response.status(204).send();
  }
}
