import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import { IPaginationQueryResponseDTO } from '../dtos/IPaginationResponseDTO';
import { IQueryListCategoriesDTO } from '../dtos/IQueryListCategoriesDTO';
import { Category } from '../infra/typeorm/entities/Category';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  list(
    options?: IQueryListCategoriesDTO
  ): Promise<IPaginationQueryResponseDTO<Category>>;
  create(data: ICreateCategoryDTO): Promise<Category>;
}
