import { Response, Request } from 'express';
import { container } from 'tsyringe';

import { CreateCarSpecificationsUseCase } from './CreateCarSpecificationUseCase';

export class CreateCarSpecificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { carId } = request.params;
    const { specificationsIds } = request.body;
    const createCarSpecificationsUseCase = container.resolve(
      CreateCarSpecificationsUseCase
    );
    const specificationsCar = await createCarSpecificationsUseCase.execute({
      carId,
      specificationsIds,
    });

    return response.status(201).json(specificationsCar);
  }
}
