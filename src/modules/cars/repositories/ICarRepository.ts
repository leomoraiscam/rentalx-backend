import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { ICreateCarDTO } from '../dtos/ICreateCarDTO';
import { IQueryListAvailableCarsDTO } from '../dtos/IQueryListAvailableCarsDTO';
import { IUpdateAvailableStatusCarDTO } from '../dtos/IUpdateAvailableStatusCarDTO';

export interface ICarRepository {
  findById(id: string): Promise<Car | null>;
  findByLicensePlate(licensePlate: string): Promise<Car | null>;
  findAvailable(data: IQueryListAvailableCarsDTO): Promise<Car[] | null>;
  create(data: ICreateCarDTO): Promise<Car>;
  updateAvailable(data: IUpdateAvailableStatusCarDTO): Promise<void>;
}
