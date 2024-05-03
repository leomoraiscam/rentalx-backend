import { IQueryListAvailableCarsDTO } from '@modules/cars/dtos/IQueryListAvailableCarsDTO';

import { ICreateRentalDTO } from '../dtos/ICreateRentalDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

export interface IRentalRepository {
  findById(id: string): Promise<Rental>;
  findByUser(userId: string): Promise<Rental[]>;
  findOpenRentalByCar(carId: string): Promise<Rental>;
  findOpenRentalByUser(userId: string): Promise<Rental>;
  findOpenRentalByDateAndCar(
    data: IQueryListAvailableCarsDTO
  ): Promise<Rental | null>;
  create(data: ICreateRentalDTO): Promise<Rental>;
  save(data: Rental): Promise<Rental>;
}
