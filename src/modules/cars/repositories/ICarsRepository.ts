import Car from '@modules/cars/infra/typeorm/entities/Car';

import ICreateCarsDTO from '../dtos/ICreateCarsDTO';

interface ICarsRepository {
  create(data: ICreateCarsDTO): Promise<Car>;
  findByLicensePlate(license_plate: string): Promise<Car>;
  findAvailable(
    category_id?: string,
    brand?: string,
    name?: string
  ): Promise<Car[]>;
}

export default ICarsRepository;
