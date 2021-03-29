import { container } from 'tsyringe';

import UserRepository from '@modules/accounts/repositories/implementations/UsersRepository';
import IUserRepository from '@modules/accounts/repositories/IUsersRepository';
import ICategoryRepository from '@modules/cars/repositories/ICategoriesRepository';
import CategoryRepository from '@modules/cars/repositories/implementations/CategoriesRepository';
import SpecificationsRepository from '@modules/cars/repositories/implementations/SpecificationRepository';
import ISpecificationRepository from '@modules/cars/repositories/ISpecificationRepository';

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  CategoryRepository
);

container.registerSingleton<ISpecificationRepository>(
  'SpecificationsRepository',
  SpecificationsRepository
);

container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
