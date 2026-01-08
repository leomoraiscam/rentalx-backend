import { FindOptionsOrdernation } from '../enums/findOptionsOrder';

export interface IQueryListOptionsDTO {
  page?: number;
  perPage?: number;
  order?: FindOptionsOrdernation;
}
