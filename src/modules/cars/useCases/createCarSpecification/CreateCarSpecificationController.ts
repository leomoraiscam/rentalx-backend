import { Response, Request } from 'express';
import { container } from 'tsyringe';

import CreateCarSpecificationsUseCase from './CreateCarSpecificationUseCase';

class CreateCarSpecificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { id } = request.params;
    const { specifications_id } = request.body;

    const createCarSpecificationsUseCase = container.resolve(
      CreateCarSpecificationsUseCase
    );

    const cars = await createCarSpecificationsUseCase.execute({
      car_id: id,
      specifications_id,
    });

    return response.status(201).json(cars);
  }
}

export default CreateCarSpecificationsController;
