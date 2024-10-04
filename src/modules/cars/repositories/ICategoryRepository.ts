import { IPaginationQueryResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';
import { IQueryListOptionsDTO } from '@shared/common/dtos/IQueryListOptionsDTO';

import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import { Category } from '../infra/typeorm/entities/Category';

export interface ICategoryRepository {
  findById(id: string): Promise<Category | null>;
  findByName(name: string): Promise<Category | null>;
  list(
    options?: IQueryListOptionsDTO
  ): Promise<IPaginationQueryResponseDTO<Category>>;
  create(data: ICreateCategoryDTO): Promise<Category>;
}
