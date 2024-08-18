import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ImportCategoriesUseCase } from './ImportCategoriesUseCase';

export class ImportCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request;
    const importCategoryController = container.resolve(ImportCategoriesUseCase);

    await importCategoryController.execute(file);

    return response.status(201).send();
  }
}
