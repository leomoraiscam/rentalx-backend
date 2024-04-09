import { getRepository, Repository } from 'typeorm';

import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';
import { IPaginationQueryResponseDTO } from '@modules/cars/dtos/IPaginationResponseDTO';
import { IQueryListCategoriesDTO } from '@modules/cars/dtos/IQueryListCategoriesDTO';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';

export class CategoryRepository implements ICategoryRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOne({
      name,
    });
  }

  async list(
    options?: IQueryListCategoriesDTO
  ): Promise<IPaginationQueryResponseDTO<Category>> {
    const take = options.perPage || 10;
    const page = options.page || 1;
    const skip = (page - 1) * take;
    const order = options.order || 'DESC';

    const [result, total] = await this.repository.findAndCount({
      take,
      skip,
      order: {
        name: order,
      },
    });

    return {
      result,
      total,
    };
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
