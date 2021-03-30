import Car from '@modules/cars/infra/typeorm/entities/Car';

import ICreateCarsDTO from '../../dtos/ICreateCarsDTO';
import ICarsRepository from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
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

  async create({
    name,
    description,
    brand,
    fine_amount,
    license_plate,
    daily_rate,
    category_id,
    id,
  }: ICreateCarsDTO): Promise<Car> {
    const car = new Car();

    Object.assign(car, {
      name,
      description,
      brand,
      fine_amount,
      license_plate,
      daily_rate,
      category_id,
      id,
    });

    this.car.push(car);

    return car;
  }
}

export default CarsRepositoryInMemory;
