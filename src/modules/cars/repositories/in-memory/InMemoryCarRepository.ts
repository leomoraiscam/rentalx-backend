import { IQueryListAvailableCarsDTO } from '@modules/cars/dtos/IQueryListAvailableCarsDTO';
import { IUpdateAvailableStatusCarDTO } from '@modules/cars/dtos/IUpdateAvailableStatusCarDTO';
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

  async findAvailable(data: IQueryListAvailableCarsDTO): Promise<Car[] | null> {
    const { brand, categoryId, name } = data;

    const cars = this.car.filter((car) => {
      if (
        car.available === true ||
        (brand && car.brand === brand) ||
        (categoryId && car.categoryId === categoryId) ||
        (name && car.name === name)
      ) {
        return car;
      }
      return null;
    });

    return cars;
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
    });

    this.car.push(car);

    return car;
  }

  async save(car: Car): Promise<Car> {
    const carIndex = this.car.findIndex((carData) => carData.id === car.id);

    this.car[carIndex] = car;

    return this.car[carIndex];
  }

  async updateAvailable(data: IUpdateAvailableStatusCarDTO): Promise<void> {
    const { available, id } = data;

    const findIndex = this.car.findIndex((car) => car.id === id);

    this.car[findIndex].available = available;
  }
}
