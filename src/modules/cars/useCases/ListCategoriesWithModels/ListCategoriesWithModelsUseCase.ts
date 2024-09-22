import { injectable, inject } from 'tsyringe';

import {
  IListCategoriesWithModelsResponseDTO,
  ICarModelsDTO,
} from '@modules/cars/dtos/IListCategoriesWithModelsResponseDTO';
import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';
import { OrdenationProps } from '@modules/cars/dtos/IQueryListOptionsDTO';
import { CarStatus } from '@modules/cars/enums/CarStatus';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { RentalStatus } from '@modules/rentals/enums/RentatStatus';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
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
    data?: IQueryListCarsDTO
  ): Promise<IListCategoriesWithModelsResponseDTO[]> {
    try {
      const { startDate, expectedReturnDate } = data;
      const [categories, cars] = await Promise.all([
        this.categoryRepository.list({
          order: OrdenationProps.DESC,
          page: 1,
          perPage: 15,
        }),
        this.carRepository.list(data),
      ]);
      const transformedCategories = categories.result.map(async (category) => {
        const carsByCategory = cars.filter(
          (car) => car.categoryId === category.id
        );
        const models = await carsByCategory.reduce(async (accPromise, car) => {
          const acc = await accPromise;
          const {
            id,
            name,
            description,
            brand,
            dailyRate,
            fineAmount,
            specifications,
            images,
            status,
          } = car;
          let available = true;

          if (
            status === CarStatus.OUT_OF_SERVICE ||
            status === CarStatus.UNDER_MAINTENANCE
          ) {
            available = false;
          } else {
            const rental = await this.rentalRepository.findByCarAndDateRange({
              startDate,
              expectedReturnDate,
              carId: id,
            });

            available =
              !rental ||
              rental.status === RentalStatus.CLOSED ||
              rental.status === RentalStatus.CANCELLED;
          }

          if (!acc[name]) {
            acc[name] = {
              name,
              brand,
              description,
              specifications,
              images,
              dailyRate: Number(dailyRate),
              fineAmount: Number(fineAmount),
              total: 0,
              totalAvailable: 0,
            };
          }

          acc[name].total += 1;

          if (available) {
            acc[name].totalAvailable += 1;
          }

          return acc;
        }, Promise.resolve({} as Record<string, ICarModelsDTO>));
        const modelsWithEachProperties = Object.values(models);
        const isAvailableCategory = modelsWithEachProperties.some(
          (car) => car.totalAvailable >= 1
        );

        return {
          id: category.id,
          name: category.name,
          type: category.type,
          models: modelsWithEachProperties,
          available: isAvailableCategory,
        };
      });
      const processedTransformedCategories = await Promise.all(
        transformedCategories
      );
      const categoriesAndModels = processedTransformedCategories.filter(
        (values) => values.models.length
      );

      return categoriesAndModels;
    } catch (error) {
      this.loggerProvider.log({
        level: 'error',
        message: `Failed to list categories and cars: ${
          error.message || error
        }`,
        metadata: { error },
      });
      throw new AppError('Failed to list categories and cars', 500);
    }
  }
}
