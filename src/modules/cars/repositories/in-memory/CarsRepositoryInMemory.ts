import Car from '@modules/cars/infra/typeorm/entities/Car';

import ICreateCarsDTO from '../../dtos/ICreateCarsDTO';
import ICarsRepository from '../ICarsRepository';

class CarsRepositoryInMemory implements ICarsRepository {
  car: Car[] = [];

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
    });

    this.car.push(car);

    return car;
  }
}

export default CarsRepositoryInMemory;
