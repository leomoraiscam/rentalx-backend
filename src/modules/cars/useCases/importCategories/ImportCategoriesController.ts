import { Request, Response } from 'express';
import { container } from 'tsyringe';

import { ImportCategoriesUseCase } from './ImportCategoriesUseCase';

export class ImportCategoriesController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request;
    const importCategoriesController = container.resolve(
      ImportCategoriesUseCase
    );

    await importCategoriesController.execute(file);

    return response.status(201).send();
  }
}
