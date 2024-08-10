import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { CreateCategoryUseCase } from './CreateCategoryUseCase';

export class CreateCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { name, description, type } = request.body;
    const createCategoryUseCase = container.resolve(CreateCategoryUseCase);
    const category = await createCategoryUseCase.execute({
      name,
      description,
      type,
    });

    return response.status(201).json(category);
  }
}
