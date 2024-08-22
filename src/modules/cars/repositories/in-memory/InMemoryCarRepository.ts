import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICreateCarDTO } from '../../dtos/ICreateCarDTO';
import { ICarRepository } from '../ICarRepository';

export class InMemoryCarRepository implements ICarRepository {
  private car: Car[] = [];

  async findById(id: string): Promise<Car | null> {
    return this.car.find((car) => car.id === id);
  }

  async findByLicensePlate(licensePlate: string): Promise<Car | null> {
    return this.car.find((car) => car.licensePlate === licensePlate);
  }

  async findAvailable(data: IQueryListCarsDTO): Promise<Car[] | null> {
    return this.car.filter((car) => {
      if (
        (!data.brand || car.brand === data.brand) &&
        (!data.type || car.category.type === data.type)
      ) {
        return car;
      }

      return null;
    });
  }

  async create(data: ICreateCarDTO): Promise<Car> {
    const {
      name,
      description,
      brand,
      categoryId,
      dailyRate,
      fineAmount,
      licensePlate,
      specifications,
      images,
      category,
    } = data;
    const car = new Car();

    Object.assign(car, {
      name,
      description,
      brand,
      categoryId,
      dailyRate,
      fineAmount,
      licensePlate,
      specifications,
      images,
      category,
    });

    this.car.push(car);

    return car;
  }

  async save(car: Car): Promise<Car> {
    const carIndex = this.car.findIndex((carData) => carData.id === car.id);

    this.car[carIndex] = car;

    return this.car[carIndex];
  }
}
