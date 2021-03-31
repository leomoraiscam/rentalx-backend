import { container } from 'tsyringe';

import UserRepository from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import IUserRepository from '@modules/accounts/repositories/IUsersRepository';
import CarsRepository from '@modules/cars//infra/typeorm/repositories/CarsRepository';
import SpecificationsRepository from '@modules/cars//infra/typeorm/repositories/SpecificationRepository';
import CarsImagesRepository from '@modules/cars/infra/typeorm/repositories/CarsImagesRepository';
import CategoryRepository from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
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

container.registerSingleton<ICarsRepository>('CarsRepository', CarsRepository);

container.registerSingleton<ICarsImagesRepository>(
  'CarsImagesRepository',
  CarsImagesRepository
);
