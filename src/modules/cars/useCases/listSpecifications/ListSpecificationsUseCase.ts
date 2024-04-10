import { injectable, inject } from 'tsyringe';

import { IPaginationResponseDTO } from '@modules/cars/dtos/IPaginationResponseDTO';
import { IQueryListCategoriesDTO } from '@modules/cars/dtos/IQueryListCategoriesDTO';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';

@injectable()
export class ListSpecificationsUseCase {
  constructor(
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository
  ) {}

  async execute({
    page,
    perPage,
    order,
  }: IQueryListCategoriesDTO): Promise<IPaginationResponseDTO<Specification>> {
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
