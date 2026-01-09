import { injectable, inject } from 'tsyringe';

import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';
import { IPaginationResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';
import { IQueryListOptionsDTO } from '@shared/common/dtos/IQueryListOptionsDTO';
import { FindOptionsOrdernation } from '@shared/common/enums/findOptionsOrder';

@injectable()
export class ListSpecificationsUseCase {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository
  ) {}

  async execute(
    query: IQueryListOptionsDTO
  ): Promise<IPaginationResponseDTO<Specification>> {
    const page = Number(query.page ?? 1);
    const perPage = Number(query.perPage ?? 10);
    const order = query.order ?? ('DESC' as FindOptionsOrdernation);

    const { result: data, total } = await this.specificationRepository.list({
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
