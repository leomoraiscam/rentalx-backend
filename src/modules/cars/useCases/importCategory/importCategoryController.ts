import { Request, Response } from 'express';

import ImportCategoryUseCase from './ImportCategoryUseCase';

class ImportCategoryController {
  constructor(private importCategoryController: ImportCategoryUseCase) {}

  async handle(request: Request, response: Response): Promise<Response> {
    const { file } = request;

    await this.importCategoryController.execute(file);

    return response.send();
  }
}

export default ImportCategoryController;
