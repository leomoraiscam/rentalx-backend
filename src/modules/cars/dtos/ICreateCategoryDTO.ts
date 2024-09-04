import { CategoryType } from '../enums/categoryType';

export interface ICreateCategoryDTO {
  name: string;
  description: string;
  type: CategoryType;
}
