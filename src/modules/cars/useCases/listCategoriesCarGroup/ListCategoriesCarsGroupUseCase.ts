import { injectable, inject } from 'tsyringe';

import { IListCategoriesCarsGroupDTO } from '@modules/cars/dtos/IListCategoriesCarsGroupDTO';
import { OrdenationProps } from '@modules/cars/dtos/IQueryListCategoriesDTO';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';

@injectable()
export class ListCategoriesCarsGroupUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository
  ) {}

  async execute(): Promise<IListCategoriesCarsGroupDTO[]> {
    const categories = await this.categoryRepository.list({
      order: OrdenationProps.DESC,
      page: 1,
      perPage: 5,
    });
    const cars = await this.carRepository.findAvailable({});

    const transformedCategories = categories.result.map(async (category) => {
      const categoryCars = cars
        .filter((car) => car.categoryId === category.id)
        .map(async (car) => {
          const rental = await this.rentalRepository.findOpenRentalByCar(
            car.id
          );
          const available = !rental;

          return {
            ...car,
            available,
          };
        });

      const carsWithAvailability = await Promise.all(categoryCars);

      const categoryAvailable = carsWithAvailability.some(
        (car) => car.available
      );

      return {
        name: category.name,
        type: category.type,
        cars: carsWithAvailability,
        available: categoryAvailable,
      };
    });

    const carsWithAvailability = await Promise.all(transformedCategories);

    return carsWithAvailability;
  }
}
