import { Request, Response } from 'express';
import { container } from 'tsyringe';

import ImportCategoryUseCase from './ImportCategoryUseCase';

class ImportCategoryController {
  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    const importCategoryController = container.resolve(ImportCategoryUseCase);

    await importCategoryController.execute(file);

    return response.status(201).send();
  }
}

export default ImportCategoryController;
