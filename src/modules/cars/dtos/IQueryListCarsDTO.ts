import { CategoryType } from '@modules/cars/enums/categoryType';

export interface IQueryListCarsDTO {
  startDate?: Date;
  expectedReturnDate?: Date;
  carId?: string;
  brand?: string;
  type?: CategoryType;
}
