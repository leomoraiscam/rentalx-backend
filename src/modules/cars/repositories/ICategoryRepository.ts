import { ICreateCategoryDTO } from '../dtos/ICreateCategoryDTO';
import { Category } from '../infra/typeorm/entities/Category';

export interface ICategoryRepository {
  findByName(name: string): Promise<Category | null>;
  list(): Promise<Category[] | null>;
  create(data: ICreateCategoryDTO): Promise<Category>;
}
