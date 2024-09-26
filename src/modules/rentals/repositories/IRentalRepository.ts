import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';

import { ICreateRentalDTO } from '../dtos/ICreateRentalDTO';
import { IListRentalsDTO } from '../dtos/IListRentalsDTO';
import { IPaginationQueryResponseDTO } from '../dtos/IPaginationResponseDTO';
import { Rental } from '../infra/typeorm/entities/Rental';

export interface IRentalRepository {
  findById(id: string): Promise<Rental>;
  findByUser(userId: string): Promise<Rental[]>;
  findActiveRentalByUser(userId: string): Promise<Rental>;
  findByCarAndDateRange(data: IQueryListCarsDTO): Promise<Rental | null>;
  list(data: IListRentalsDTO): Promise<IPaginationQueryResponseDTO<Rental>>;
  create(data: ICreateRentalDTO): Promise<Rental>;
  save(data: Rental): Promise<Rental>;
}
