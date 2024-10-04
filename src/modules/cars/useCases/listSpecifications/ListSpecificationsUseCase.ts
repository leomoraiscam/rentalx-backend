import { injectable, inject } from 'tsyringe';

import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';
import { IPaginationResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';
import { IQueryListOptionsDTO } from '@shared/common/dtos/IQueryListOptionsDTO';

@injectable()
export class ListSpecificationsUseCase {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository
  ) {}

  async execute(
    query: IQueryListOptionsDTO
  ): Promise<IPaginationResponseDTO<Specification>> {
    const { page, perPage, order } = query;
    const specifications = await this.specificationRepository.list({
      page,
      perPage,
      order,
    });
    const { total } = specifications;
    const { result: data } = specifications;
    const totalPages = Math.ceil(total / perPage);

    return {
      data,
      total,
      totalPages,
    };
  }
}
