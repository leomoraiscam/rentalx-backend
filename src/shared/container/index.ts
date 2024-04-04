import { container } from 'tsyringe';

import '@shared/container/providers';

import { UserRepository } from '@modules/accounts/infra/typeorm/repositories/UserRepository';
import { UserTokenRepository } from '@modules/accounts/infra/typeorm/repositories/UserTokenRepository';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import CarsRepository from '@modules/cars//infra/typeorm/repositories/CarsRepository';
import SpecificationsRepository from '@modules/cars//infra/typeorm/repositories/SpecificationRepository';
import CarsImagesRepository from '@modules/cars/infra/typeorm/repositories/CarsImagesRepository';
import CategoryRepository from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import ICategoryRepository from '@modules/cars/repositories/ICategoriesRepository';
import ISpecificationRepository from '@modules/cars/repositories/ISpecificationRepository';
import RentalsRepository from '@modules/rentals/infra/typeorm/repositories/RentalsRepository';
import IRentalsRepository from '@modules/rentals/repositories/IRentalsRepository';

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

container.registerSingleton<IRentalsRepository>(
  'RentalsRepository',
  RentalsRepository
);

container.registerSingleton<IUserTokenRepository>(
  'UsersTokensRepository',
  UserTokenRepository
);
