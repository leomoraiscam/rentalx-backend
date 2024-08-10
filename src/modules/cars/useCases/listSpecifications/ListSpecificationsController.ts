import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { OrdenationProps } from '@modules/cars/dtos/IQueryListCategoriesDTO';

import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';

export class ListSpecificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, perPage, order } = request.query;
    const listSpecificationsUseCase = container.resolve(
      ListSpecificationsUseCase
    );
    const specifications = await listSpecificationsUseCase.execute({
      order: order as OrdenationProps,
      page: Number(page),
      perPage: Number(perPage),
    });

    return response.status(200).json(specifications);
  }
}
