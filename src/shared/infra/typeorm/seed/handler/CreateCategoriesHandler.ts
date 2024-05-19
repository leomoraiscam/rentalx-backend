import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';
import { CreateCategoryUseCase } from '@modules/cars/useCases/createCategory/CreateCategoryUseCase';

import { ISeederHandler } from '../adapters/ports/ISeederHandler';

export class CreateCategoriesHandler implements ISeederHandler {
  constructor(private createCategoryUseCase: CreateCategoryUseCase) {}

  async handle(data: ICreateCategoryDTO[]): Promise<void> {
    const categories = data.map(async (category) => {
      await this.createCategoryUseCase.execute(category);
    });

    await Promise.all(categories);
  }
}
