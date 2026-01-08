/* eslint-disable no-restricted-syntax */
import { injectable, inject } from 'tsyringe';

import { IListCarsGroupedByCategoryDTO } from '@modules/cars/dtos/IListCarsByCategoryDTO';
import {
  IListCarsByCategoryResponseDTO,
  IGroupedCarsWithOptionsDTO,
} from '@modules/cars/dtos/IListCarsByCategoryResponseDTO';
import { CarStatus } from '@modules/cars/enums/carStatus';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ListCarsGroupedByCategoryUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('LoggerProvider')
    private loggerProvider: ILoggerProvider
  ) {}

  async execute(
    data: IListCarsGroupedByCategoryDTO
  ): Promise<IListCarsByCategoryResponseDTO> {
    try {
      const { categoryId, startDate, expectedReturnDate } = data;
      const [category, cars] = await Promise.all([
        this.categoryRepository.findById(categoryId),
        this.carRepository.list({ categoryId }),
      ]);

      const carIds = cars.map((car) => car.id);
      const busyRentals = await this.rentalRepository.findOpenRentalsByCars({
        carIds,
        startDate,
        expectedReturnDate,
      });

      const busyCarIds = new Set(busyRentals.map((rental) => rental.carId));
      const groupedModels: Record<string, IGroupedCarsWithOptionsDTO> = {};

      for (const car of cars) {
        if (!groupedModels[car.name]) {
          groupedModels[car.name] = {
            name: car.name,
            brand: car.brand,
            dailyRate: Number(car.dailyRate),
            fineAmount: Number(car.fineAmount),
            total: 0,
            totalAvailable: 0,
            cars: [],
          };
        }

        const group = groupedModels[car.name];

        const isCarBroken =
          car.status === CarStatus.OUT_OF_SERVICE ||
          car.status === CarStatus.UNDER_MAINTENANCE;
        const isCarRented = busyCarIds.has(car.id);
        const isAvailable = !isCarBroken && !isCarRented;

        group.total += 1;

        if (isAvailable) {
          group.totalAvailable += 1;
        }

        group.cars.push({
          id: car.id,
          licensePlate: car.licensePlate,
          status: car.status,
          specifications: car.specifications,
          images: car.images,
        });
      }

      return {
        id: category.id,
        name: category.name,
        type: category.type,
        models: Object.values(groupedModels),
      };
    } catch (error) {
      this.loggerProvider.log({
        level: 'error',
        message: 'Failed to list cars',
        metadata: { error: error.message },
      });

      throw new AppError('Failed to list cars', 500);
    }
  }
}
