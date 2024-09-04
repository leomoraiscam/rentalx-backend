import { CategoryType } from '@modules/cars/enums/CategoryType';

export interface IQueryListCarsDTO {
  startDate?: Date;
  expectedReturnDate?: Date;
  carId?: string;
  brand?: string;
  type?: CategoryType;
}
