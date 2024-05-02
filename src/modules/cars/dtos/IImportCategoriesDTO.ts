import { CategoryType } from './ICreateCategoryDTO';

export interface IImportCategoriesDTO {
  name: string;
  description: string;
  type: CategoryType;
}
