import { container } from 'tsyringe';

import UserRepository from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import IUserRepository from '@modules/accounts/repositories/IUsersRepository';
import SpecificationsRepository from '@modules/cars//infra/typeorm/repositories/SpecificationRepository';
import CategoryRepository from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import ICategoryRepository from '@modules/cars/repositories/ICategoriesRepository';
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
