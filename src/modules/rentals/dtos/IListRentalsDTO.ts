import { IQueryListOptionsDTO } from '@shared/common/dtos/IQueryListOptionsDTO';

export interface IListRentalsDTO extends IQueryListOptionsDTO {
  startDate?: Date;
  endDate?: Date;
  status?: string | string[];
  categoryIds?: string | string[];
}
