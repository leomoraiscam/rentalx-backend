import { container } from 'tsyringe';

import ICategoryRepository from '../../modules/cars/repositories/ICategoriesRepository';
import CategoryRepository from '../../modules/cars/repositories/implementations/CategoriesRepository';

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  CategoryRepository
);
