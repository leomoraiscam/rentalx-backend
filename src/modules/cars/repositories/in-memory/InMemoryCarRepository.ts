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

  async list(data: IQueryListCarsDTO): Promise<Car[] | null> {
    return this.car.filter((car) => {
      if (
        (!data.brand || car.brand === data.brand) &&
        (!data.type ||
          car.categoryId === data.categoryId ||
          car.category.type === data.type)
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
      status,
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
      status,
    });

    this.car.push(car);

    return car;
  }

  async save(data: Car): Promise<void> {
    const findCarIndex = this.car.findIndex((car) => car.id === data.id);

    this.car[findCarIndex] = data;
  }
}
