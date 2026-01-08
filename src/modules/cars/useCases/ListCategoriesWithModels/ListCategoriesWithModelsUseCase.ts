/* eslint-disable no-continue */
/* eslint-disable no-restricted-syntax */
import { injectable, inject } from 'tsyringe';

import {
  IListCategoriesWithModelsResponseDTO,
  ICarModelsDTO,
} from '@modules/cars/dtos/IListCategoriesWithModelsResponseDTO';
import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';
import { CarStatus } from '@modules/cars/enums/carStatus';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { OrdenationProps } from '@shared/common/dtos/IQueryListOptionsDTO';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ListCategoriesWithModelsUseCase {
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
    data: IQueryListCarsDTO
  ): Promise<IListCategoriesWithModelsResponseDTO[]> {
    try {
      const { startDate, expectedReturnDate } = data;
      const [categoriesResponse, cars] = await Promise.all([
        this.categoryRepository.list({
          order: OrdenationProps.DESC,
          page: 1,
          perPage: 15,
        }),
        this.carRepository.list(data),
      ]);

      const carIds = cars.map((car) => car.id);
      const busyRentals = await this.rentalRepository.findOpenRentalsByCars({
        carIds,
        startDate,
        expectedReturnDate,
      });

      const busyCarIds = new Set(busyRentals.map((rental) => rental.carId));
      const formattedResponse: IListCategoriesWithModelsResponseDTO[] = [];

      for (const category of categoriesResponse.result) {
        const categoryCars = cars.filter(
          (car) => car.categoryId === category.id
        );

        if (categoryCars.length === 0) {
          continue;
        }

        const modelsMap: Record<string, ICarModelsDTO> = {};

        for (const car of categoryCars) {
          const isBroken =
            car.status === CarStatus.OUT_OF_SERVICE ||
            car.status === CarStatus.UNDER_MAINTENANCE;
          const isRented = busyCarIds.has(car.id);
          const isAvailable = !isBroken && !isRented;

          if (!modelsMap[car.name]) {
            modelsMap[car.name] = {
              name: car.name,
              brand: car.brand,
              description: car.description,
              specifications: car.specifications,
              images: car.images,
              dailyRate: Number(car.dailyRate),
              fineAmount: Number(car.fineAmount),
              total: 0,
              totalAvailable: 0,
            };
          }

          modelsMap[car.name].total += 1;

          if (isAvailable) {
            modelsMap[car.name].totalAvailable += 1;
          }
        }

        const modelsList = Object.values(modelsMap);

        if (modelsList.length > 0) {
          const isAvailableCategory = modelsList.some(
            (model) => model.totalAvailable >= 1
          );

          formattedResponse.push({
            id: category.id,
            name: category.name,
            type: category.type,
            models: modelsList,
            available: isAvailableCategory,
          });
        }
      }

      return formattedResponse;
    } catch (error) {
      this.loggerProvider.log({
        level: 'error',
        message: 'Failed to list categories and cars',
        metadata: { error: error.message },
      });

      throw new AppError('Failed to list categories and cars', 500);
    }
  }
}
