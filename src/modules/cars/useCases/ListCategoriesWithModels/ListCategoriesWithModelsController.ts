import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CategoryType } from '@modules/cars/enums/CategoryType';

import { ListCategoriesWithModelsUseCase } from './ListCategoriesWithModelsUseCase';

export class ListCategoriesWithModelsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      brand,
      type,
      startDate,
      expectedReturnDate,
      categoryId,
    } = request.query;
    const listCategoriesWithModelsUseCase = container.resolve(
      ListCategoriesWithModelsUseCase
    );
    const cars = await listCategoriesWithModelsUseCase.execute({
      brand: brand as string,
      type: type as CategoryType,
      startDate: new Date(startDate as string),
      expectedReturnDate: new Date(expectedReturnDate as string),
      categoryId: categoryId as string,
    });

    return response.status(200).json(cars);
  }
}
