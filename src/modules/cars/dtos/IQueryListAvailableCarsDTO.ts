import { CategoryType } from '@modules/cars/enums/category';

export interface IQueryListAvailableCarsDTO {
  startDate?: Date;
  expectedReturnDate?: Date;
  carId?: string;
  brand?: string;
  type?: CategoryType;
}
