import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListAvailableCarsUseCase } from './ListAvailableCarsUseCase';

export class ListAvailableCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { categoryId, brand, name } = request.query;

    const listAvailableCarsUseCase = container.resolve(
      ListAvailableCarsUseCase
    );
    const cars = await listAvailableCarsUseCase.execute({
      brand: brand as string,
      name: name as string,
      categoryId: categoryId as string,
    });

    return response.status(200).json(cars);
  }
}
