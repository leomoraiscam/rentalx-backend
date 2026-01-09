import { injectable, inject } from 'tsyringe';

import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { IPaginationResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';
import { IQueryListOptionsDTO } from '@shared/common/dtos/IQueryListOptionsDTO';
import { FindOptionsOrdernation } from '@shared/common/enums/findOptionsOrder';

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
    const page = Number(query.page ?? 1);
    const perPage = Number(query.perPage ?? 10);
    const order = query.order ?? ('DESC' as FindOptionsOrdernation);

    const { result: data, total } = await this.categoryRepository.list({
      page,
      perPage,
      order,
    });
    const totalPages = Math.ceil(total / perPage);

    return {
      data,
      total,
      totalPages,
    };
  }
}
