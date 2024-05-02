import { CategoryType } from './ICreateCategoryDTO';

export interface IQueryListAvailableCarsDTO {
  startDate?: Date;
  expectedReturnDate?: Date;
  carId?: string;
  brand?: string;
  type?: CategoryType;
}
