/* eslint-disable no-restricted-syntax */
import { IQueryListAvailableCarsDTO } from '@modules/cars/dtos/IQueryListAvailableCarsDTO';
import { IUpdateAvailableStatusCarDTO } from '@modules/cars/dtos/IUpdateAvailableStatusCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';

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

  async findAvailable(): Promise<Car[] | null> {
    return this.car;
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
