import { injectable, inject } from 'tsyringe';

import { IListCarsGroupedByCategoryDTO } from '@modules/cars/dtos/IListCarsGroupedByCategoryDTO';
import {
  IListCarsGroupedByCategoryResponseDTO,
  ICarsModel,
} from '@modules/cars/dtos/IListCarsGroupedByCategoryResponseDTO';
import { CarStatus } from '@modules/cars/enums/CarStatus';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { RentalStatus } from '@modules/rentals/enums/RentatStatus';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';

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
  ): Promise<IListCarsGroupedByCategoryResponseDTO> {
    const { categoryId, expectedReturnDate, startDate } = data;
    const [category, cars] = await Promise.all([
      this.categoryRepository.findById(categoryId),
      this.carRepository.list({ categoryId }),
    ]);

    const models = cars.reduce(async (accPromise, car) => {
      const acc = await accPromise;
      let available = true;

      if (
        car.status === CarStatus.OUT_OF_SERVICE ||
        car.status === CarStatus.UNDER_MAINTENANCE
      ) {
        available = false;
      } else {
        const rental = await this.rentalRepository.findByCarAndDateRange({
          startDate,
          expectedReturnDate,
          carId: car.id,
        });

        available =
          !rental ||
          rental.status === RentalStatus.CLOSED ||
          rental.status === RentalStatus.CANCELLED;
      }

      if (!acc[car.name]) {
        acc[car.name] = {
          name: car.name,
          brand: car.brand,
          dailyRate: Number(car.dailyRate),
          fineAmount: Number(car.fineAmount),
          total: 0,
          totalAvailable: 0,
          cars: [],
        };
      }

      acc[car.name].total += 1;

      if (available) {
        acc[car.name].totalAvailable += 1;
      }

      acc[car.name].cars.push({
        id: car.id,
        licensePlate: car.licensePlate,
        status: car.status,
        specifications: car.specifications,
        images: car.images,
      });

      return acc;
    }, Promise.resolve({} as Record<string, ICarsModel>));

    const carsWithAvailabilityField = Object.values(await models);

    return {
      id: category.id,
      name: category.name,
      type: category.type,
      models: carsWithAvailabilityField,
    };
  }
}
