import { container } from 'tsyringe';

import ICategoryRepository from '../../modules/cars/repositories/ICategoriesRepository';
import CategoryRepository from '../../modules/cars/repositories/implementations/CategoriesRepository';
import SpecificationsRepository from '../../modules/cars/repositories/implementations/SpecificationRepository';
import ISpecificationRepository from '../../modules/cars/repositories/ISpecificationRepository';

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  CategoryRepository
);

container.registerSingleton<ISpecificationRepository>(
  'SpecificationRepository',
  SpecificationsRepository
);
