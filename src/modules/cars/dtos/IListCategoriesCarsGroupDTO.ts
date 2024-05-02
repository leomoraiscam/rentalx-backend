import { Car } from '../infra/typeorm/entities/Car';

export interface IListCategoriesCarsGroupDTO {
  name: string;
  type: string;
  cars: Car[];
  available: boolean;
}
