import { getRepository, Repository } from 'typeorm';

import { ICreateCategoryDTO } from '@modules/cars/dtos/ICreateCategoryDTO';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { IPaginationQueryResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';
import { IQueryListOptionsDTO } from '@shared/common/dtos/IQueryListOptionsDTO';

export class CategoryRepository implements ICategoryRepository {
  private repository: Repository<Category>;

  constructor() {
    this.repository = getRepository(Category);
  }

  async findById(id: string): Promise<Category | null> {
    return this.repository.findOne(id);
  }

  async findByName(name: string): Promise<Category | null> {
    return this.repository.findOne({
      name,
    });
  }

  async list(
    options?: IQueryListOptionsDTO
  ): Promise<IPaginationQueryResponseDTO<Category>> {
    const { perPage, page, order } = options;

    const [result, total] = await this.repository.findAndCount({
      take: perPage,
      skip: (page - 1) * perPage,
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
    const { name, description, type } = data;
    const category = this.repository.create({
      name,
      description,
      type,
    });

    await this.repository.save(category);

    return category;
  }
}
