import { CategoryRepository } from '@modules/cars/infra/typeorm/repositories/CategoryRepository';
import { CreateCategoryUseCase } from '@modules/cars/useCases/createCategory/CreateCategoryUseCase';

import { CreateCategoriesHandler } from '../handler/CreateCategoriesHandler';

export function makeCreateCategoriesHandler(): CreateCategoriesHandler {
  const categoryRepository = new CategoryRepository();

  const createCategoryUseCase = new CreateCategoryUseCase(categoryRepository);

  const createCategoriesHandler = new CreateCategoriesHandler(
    createCategoryUseCase
  );

  return createCategoriesHandler;
}
