import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { FindOptionsOrdernation } from '@shared/common/enums/findOptionsOrder';

import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';

export class ListSpecificationsController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { page, perPage, order } = request.query;
    const listSpecificationsUseCase = container.resolve(
      ListSpecificationsUseCase
    );
    const specifications = await listSpecificationsUseCase.execute({
      order: order as FindOptionsOrdernation,
      page: Number(page),
      perPage: Number(perPage),
    });

    return response.status(200).json(specifications);
  }
}
