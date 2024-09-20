import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CategoryType } from '@modules/cars/enums/CategoryType';

import { ListCategoriesWithGroupedCarsUseCase } from './ListCategoriesWithGroupedCarsUseCase';

export class ListCategoriesWithGroupedCarsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const {
      brand,
      type,
      startDate,
      expectedReturnDate,
      categoryId,
    } = request.query;
    const listCategoriesCarsGroupUseCase = container.resolve(
      ListCategoriesWithGroupedCarsUseCase
    );
    const cars = await listCategoriesCarsGroupUseCase.execute({
      brand: brand as string,
      type: type as CategoryType,
      startDate: new Date(startDate as string),
      expectedReturnDate: new Date(expectedReturnDate as string),
      categoryId: categoryId as string,
    });

    return response.status(200).json(cars);
  }
}
