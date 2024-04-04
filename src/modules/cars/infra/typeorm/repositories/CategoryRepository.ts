import { getRepository, Repository } from 'typeorm';

import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { ICategoriesRepository } from '@modules/cars/repositories/ICategoryRepository';

export class CategoryRepository implements ICategoriesRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOne({
      name,
    });
  }

  async list(): Promise<Category[] | null> {
    return this.repository.find();
  }

  async create(data: ICreateCategoryDTO): Promise<Category> {
    const { name, description } = data;

    const category = this.repository.create({
      name,
      description,
    });

    await this.repository.save(category);

    return category;
  }
}
