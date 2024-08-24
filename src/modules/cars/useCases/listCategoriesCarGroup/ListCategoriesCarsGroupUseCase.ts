import { injectable, inject } from 'tsyringe';

import { IListCategoriesCarsGroupDTO } from '@modules/cars/dtos/IListCategoriesCarsGroupDTO';
import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';
import { OrdenationProps } from '@modules/cars/dtos/IQueryListOptionsDTO';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ListCategoriesCarsGroupUseCase {
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
  ): Promise<IListCategoriesCarsGroupDTO[]> {
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
        const categoryCars = cars
          .filter((car) => car.categoryId === category.id)
          .map(async ({ id: carId, dailyRate, fineAmount, ...carRest }) => {
            const rental = await this.rentalRepository.findOpenRentalByDateAndCar(
              {
                startDate,
                expectedReturnDate,
                carId,
              }
            );
            const available = !rental;

            return {
              id: carId,
              dailyRate: Number(dailyRate),
              fineAmount: Number(fineAmount),
              available,
              ...carRest,
            };
          });

        const carsWithAvailabilityField = await Promise.all(categoryCars);
        const isAvailableCategory = carsWithAvailabilityField.some(
          (car) => car.available
        );

        return {
          name: category.name,
          type: category.type,
          cars: carsWithAvailabilityField,
          available: isAvailableCategory,
        };
      });
      const categoryCarsProcessedPromises = await Promise.all(
        transformedCategories
      );
      const carsWithAvailabilityFieldLength = categoryCarsProcessedPromises.filter(
        (values) => values.cars.length
      );

      return carsWithAvailabilityFieldLength;
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
