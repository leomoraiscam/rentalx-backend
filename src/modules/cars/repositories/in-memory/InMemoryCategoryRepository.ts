import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';
import { IPaginationQueryResponseDTO } from '@modules/cars/dtos/IPaginationResponseDTO';
import { IQueryListOptionsDTO } from '@modules/cars/dtos/IQueryListOptionsDTO';

import { Category } from '../../infra/typeorm/entities/Category';
import { ICategoryRepository } from '../ICategoryRepository';

export class InMemoryCategoryRepository implements ICategoryRepository {
  private categories: Category[] = [];

  async findById(id: string): Promise<Category> {
    return this.categories.find((category) => category.id === id);
  }

  async findByName(name: string): Promise<Category | null> {
    return this.categories.find((category) => category.name === name);
  }

  async list(
    options: IQueryListOptionsDTO
  ): Promise<IPaginationQueryResponseDTO<Category>> {
    let sortedCategories = this.categories;

    const take = options.perPage || 10;
    const page = options.page || 1;
    const order = options.order || 'DESC';

    if (order === 'ASC') {
      sortedCategories = sortedCategories.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (order === 'DESC') {
      sortedCategories = sortedCategories.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    const startIndex = (page - 1) * take;
    const endIndex = startIndex + take;

    const data = sortedCategories.slice(startIndex, endIndex);

    return {
      result: data,
      total: this.categories.length,
    };
  }

  async create({
    name,
    description,
    type,
  }: ICreateCategoryDTO): Promise<Category> {
    const category = new Category();

    Object.assign(category, {
      name,
      description,
      type,
    });

    this.categories.push(category);

    return category;
  }
}
