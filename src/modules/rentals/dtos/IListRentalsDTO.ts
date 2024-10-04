import { IQueryListOptionsDTO } from './IQueryListOptionsDTO';

export interface IListRentalsDTO extends IQueryListOptionsDTO {
  startDate?: Date;
  endDate?: Date;
  status?: string | string[];
  categoryIds?: string | string[];
}
