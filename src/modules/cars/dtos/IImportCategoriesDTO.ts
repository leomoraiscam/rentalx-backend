import { CategoryType } from '../enums/category';

export interface IImportCategoriesDTO {
  name: string;
  description: string;
  type: CategoryType;
}
