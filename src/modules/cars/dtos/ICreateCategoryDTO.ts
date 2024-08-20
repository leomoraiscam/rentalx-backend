import { CategoryType } from '../enums/category';

export interface ICreateCategoryDTO {
  name: string;
  description: string;
  type: CategoryType;
}
