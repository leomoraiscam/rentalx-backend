import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IQueryListCarsDTO } from '../dtos/IQueryListCarsDTO';

export interface ICarRepository {
  findById(id: string): Promise<Car | null>;
  findByLicensePlate(licensePlate: string): Promise<Car | null>;
  findAvailable(data: IQueryListCarsDTO): Promise<Car[] | null>;
  create(data: ICreateCarDTO): Promise<Car>;
  save(car: Car): Promise<Car>;
}
