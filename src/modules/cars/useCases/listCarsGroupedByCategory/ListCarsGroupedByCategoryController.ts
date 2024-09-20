import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ListCarsGroupedByCategoryUseCase } from './ListCarsGroupedByCategoryUseCase';

export class ListCarsGroupedByCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { startDate, expectedReturnDate, categoryId } = request.query;
    const listCarsGroupedByCategoryUseCase = container.resolve(
      ListCarsGroupedByCategoryUseCase
    );
    const cars = await listCarsGroupedByCategoryUseCase.execute({
      startDate: new Date(startDate as string),
      expectedReturnDate: new Date(expectedReturnDate as string),
      categoryId: String(categoryId),
    });

    return response.status(200).json(cars);
  }
}
