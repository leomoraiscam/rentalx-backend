import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';

import { ICreateRentalDTO } from '../dtos/ICreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

export interface IRentalRepository {
  findById(id: string): Promise<Rental>;
  findByUser(userId: string): Promise<Rental[]>;
  findOpenRentalByCar(carId: string): Promise<Rental>;
  findActiveRentalByUser(userId: string): Promise<Rental>;
  findByCarAndDateRange(data: IQueryListCarsDTO): Promise<Rental | null>;
  create(data: ICreateRentalDTO): Promise<Rental>;
  save(data: Rental): Promise<Rental>;
}
