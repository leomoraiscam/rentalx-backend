import { CategoryType } from './ICreateCategoryDTO';

export interface IQueryListAvailableCarsDTO {
  brand?: string;
  type?: CategoryType;
}
