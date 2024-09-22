import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCarUseCase } from './CreateCarUseCase';

export class CreateCarController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      name,
      description,
      dailyRate,
      licensePlate,
      fineAmount,
      brand,
      categoryId,
      specifications,
      status,
    } = request.body;
    const createCarUseCase = container.resolve(CreateCarUseCase);
    const car = await createCarUseCase.execute({
      name,
      description,
      dailyRate,
      licensePlate,
      fineAmount,
      brand,
      categoryId,
      specifications,
      status,
    });

    return response.status(201).json(car);
  }
}
