import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';

import { Category } from '../../infra/typeorm/entities/Category';
import { ICategoryRepository } from '../ICategoryRepository';

export class InMemoryCategoryRepository implements ICategoryRepository {
  private categories: Category[] = [];

  async findByName(name: string): Promise<Category> {
    return this.categories.find((category) => category.name === name);
  }

  async list(): Promise<Category[]> {
    return this.categories;
  }

  async create({ name, description }: ICreateCategoryDTO): Promise<Category> {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
    });

    this.categories.push(category);

    return category;
  }
}
