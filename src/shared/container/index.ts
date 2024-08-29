import { container } from 'tsyringe';

import '@shared/container/providers';

import { UserRepository } from '@modules/accounts/infra/typeorm/repositories/UserRepository';
import { UserTokenRepository } from '@modules/accounts/infra/typeorm/repositories/UserTokenRepository';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import { CarRepository } from '@modules/cars//infra/typeorm/repositories/CarRepository';
import { SpecificationRepository } from '@modules/cars//infra/typeorm/repositories/SpecificationRepository';
import { CarImageRepository } from '@modules/cars/infra/typeorm/repositories/CarImageRepository';
import { CategoryRepository } from '@modules/cars/infra/typeorm/repositories/CategoryRepository';
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';
import { RentalRepository } from '@modules/rentals/infra/typeorm/repositories/RentalRepository';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { RentalDateService } from '@modules/rentals/services/implementations/RentalDateService';
import { IRentalDateService } from '@modules/rentals/services/IRentalDateService';

container.registerSingleton<ICategoryRepository>(
  'CategoryRepository',
  CategoryRepository
);
container.registerSingleton<ISpecificationRepository>(
  'SpecificationRepository',
  SpecificationRepository
);
container.registerSingleton<IUserRepository>('UserRepository', UserRepository);
container.registerSingleton<ICarRepository>('CarRepository', CarRepository);
container.registerSingleton<ICarImageRepository>(
  'CarImageRepository',
  CarImageRepository
);
container.registerSingleton<IRentalRepository>(
  'RentalRepository',
  RentalRepository
);
container.registerSingleton<IUserTokenRepository>(
  'UserTokenRepository',
  UserTokenRepository
);

container.registerSingleton<IRentalDateService>(
  'RentalDateService',
  RentalDateService
);
