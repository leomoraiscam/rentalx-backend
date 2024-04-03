import Car from '@modules/cars/infra/typeorm/entities/Car';

import { ICreateCarDTO } from '../../dtos/ICreateCarDTO';
import { ICarRepository } from '../ICarRepository';

export class InMemoryCarRepository implements ICarRepository {
  car: Car[] = [];

  async findAvailable(
    category_id?: string,
    brand?: string,
    name?: string
  ): Promise<Car[]> {
    const cars = this.car.filter((car) => {
      if (
        car.available === true ||
        (brand && car.brand === brand) ||
        (category_id && car.category_id === category_id) ||
        (name && car.name === name)
      ) {
        return car;
      }
      return null;
    });

    return cars;
  }

  async findById(id: string): Promise<Car> {
    return this.car.find((car) => car.id === id);
  }

  async findByLicensePlate(license_plate: string): Promise<Car> {
    const car = this.car.find((car) => car.license_plate === license_plate);

    return car;
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

  async updateAvailable(id: string, available: boolean): Promise<void> {
    const findIndex = this.car.findIndex((car) => car.id === id);

    this.car[findIndex].available = available;
  }
}
