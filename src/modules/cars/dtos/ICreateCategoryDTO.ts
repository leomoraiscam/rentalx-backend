import { CategoryType } from '../enums/CategoryType';

export interface ICreateCategoryDTO {
  name: string;
  description: string;
  type: CategoryType;
}
