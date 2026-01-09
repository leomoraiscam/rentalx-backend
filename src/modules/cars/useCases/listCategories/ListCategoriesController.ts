import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindOptionsOrdernation } from '@shared/common/enums/findOptionsOrder';

import { ListCategoriesUseCase } from './ListCategoriesUseCase';

export class ListCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, perPage, order } = request.query;
    const listCategoriesUseCase = container.resolve(ListCategoriesUseCase);
    const categories = await listCategoriesUseCase.execute({
      order: order as FindOptionsOrdernation,
      page: (page as unknown) as number,
      perPage: (perPage as unknown) as number,
    });

    return response.status(200).json(categories);
  }
}
