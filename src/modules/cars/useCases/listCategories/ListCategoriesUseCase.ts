import { injectable, inject } from 'tsyringe';

import { IPaginationResponseDTO } from '@modules/cars/dtos/IPaginationResponseDTO';
import { IQueryListOptionsDTO } from '@modules/cars/dtos/IQueryListOptionsDTO';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';

import { Category } from '../../infra/typeorm/entities/Category';

@injectable()
export class ListCategoriesUseCase {
  constructor(
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository
  ) {}

  async execute(
    query: IQueryListOptionsDTO
  ): Promise<IPaginationResponseDTO<Category>> {
    const { page, perPage, order } = query;
    const categories = await this.categoryRepository.list({
      page,
      perPage,
      order,
    });
    const { total } = categories;
    const { result: data } = categories;
    const totalPages = Math.ceil(total / perPage);

    return {
      data,
      total,
      totalPages,
    };
  }
}
