import { RentalStatus } from '../enums/RentatStatus';
import { IQueryListOptionsDTO } from './IQueryListOptionsDTO';

export interface IListRentalsDTO extends IQueryListOptionsDTO {
  startDate?: Date;
  endDate?: Date;
  status?: RentalStatus[] | string[];
  categoryIds?: string | string[];
}
