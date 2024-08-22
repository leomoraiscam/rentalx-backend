import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { OrdenationProps } from '@modules/cars/dtos/IQueryListOptionsDTO';

import { ListCategoriesUseCase } from './ListCategoriesUseCase';

export class ListCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, perPage, order } = request.query;
    const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);
    const categories = await listCategoriesUseCase.execute({
      order: order as OrdenationProps,
      page: Number(page),
      perPage: Number(perPage),
    });

    return response.status(200).json(categories);
  }
}
