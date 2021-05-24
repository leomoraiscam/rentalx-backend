import { container } from 'tsyringe';

import '@shared/container/providers';

import UserRepository from '@modules/accounts/infra/typeorm/repositories/UsersRepository';
import UsersTokensRepository from '@modules/accounts/infra/typeorm/repositories/UsersTokensRepository';
import IUserRepository from '@modules/accounts/repositories/IUsersRepository';
import IUsersTokensRepository from '@modules/accounts/repositories/IUsersTokensRepository';
import CarsRepository from '@modules/cars//infra/typeorm/repositories/CarsRepository';
import SpecificationsRepository from '@modules/cars//infra/typeorm/repositories/SpecificationRepository';
import CarsImagesRepository from '@modules/cars/infra/typeorm/repositories/CarsImagesRepository';
import CategoryRepository from '@modules/cars/infra/typeorm/repositories/CategoriesRepository';
import ICarsImagesRepository from '@modules/cars/repositories/ICarsImagesRepository';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import ICategoryRepository from '@modules/cars/repositories/ICategoriesRepository';
import ISpecificationRepository from '@modules/cars/repositories/ISpecificationRepository';
import EmailRepository from '@modules/emails/infra/typeorm/repositories/EmailRepositoty';
import IEmailRepository from '@modules/emails/repositories/IEmailRepository';
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

container.registerSingleton<IUsersTokensRepository>(
  'UsersTokensRepository',
  UsersTokensRepository
);

container.registerSingleton<IEmailRepository>(
  'EmailsRepository',
  EmailRepository
);
