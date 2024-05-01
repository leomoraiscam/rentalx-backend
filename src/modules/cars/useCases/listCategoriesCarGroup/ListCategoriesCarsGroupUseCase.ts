import { injectable, inject } from 'tsyringe';

import { IListCategoriesCarsGroupDTO } from '@modules/cars/dtos/IListCategoriesCarsGroupDTO';
import { IQueryListAvailableCarsDTO } from '@modules/cars/dtos/IQueryListAvailableCarsDTO';
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

  async execute(
    data?: IQueryListAvailableCarsDTO
  ): Promise<IListCategoriesCarsGroupDTO[]> {
    const categories = await this.categoryRepository.list({
      order: OrdenationProps.DESC,
      page: 1,
      perPage: 5,
    });
    const cars = await this.carRepository.findAvailable(data);

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

    // if (data.brand || data.type) {
    //   const filteredCategories = carsWithAvailability
    //     .map((category) => ({
    //       ...category,
    //       cars: category.cars.filter((car) => {
    //         return (
    //           (!data.brand || car.brand === data.brand) &&
    //           (!data.type || category.type === data.type)
    //         );
    //       }),
    //     }))
    //     .filter((category) => {
    //       return category.cars.length > 0;
    //     });

    //   return filteredCategories;
    // }

    return carsWithAvailability;
  }
}
