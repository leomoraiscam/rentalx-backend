import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import { IPaginationQueryResponseDTO } from '../dtos/IPaginationResponseDTO';
import { IQueryListOptionsDTO } from '../dtos/IQueryListOptionsDTO';
import { Category } from '../infra/typeorm/entities/Category';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  list(
    options?: IQueryListOptionsDTO
  ): Promise<IPaginationQueryResponseDTO<Category>>;
  create(data: ICreateCategoryDTO): Promise<Category>;
}
