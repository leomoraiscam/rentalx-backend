import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CategoryType } from '@modules/cars/dtos/ICreateCategoryDTO';

import { ListCategoriesCarsGroupUseCase } from './ListCategoriesCarsGroupUseCase';

export class ListCategoriesCarsGroupController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { brand, type, startDate, expectedReturnDate } = request.query;
    const listCategoriesCarsGroupUseCase = container.resolve(
      ListCategoriesCarsGroupUseCase
    );
    const cars = await listCategoriesCarsGroupUseCase.execute({
      brand: brand as string,
      type: type as CategoryType,
      startDate: new Date(startDate as string),
      expectedReturnDate: new Date(expectedReturnDate as string),
    });

    return response.status(200).json(cars);
  }
}
