import { injectable, inject } from 'tsyringe';

import { OrdenationProps } from '@modules/rentals/dtos/IQueryListOptionsDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';

import { IListRentalsDTO } from '../../dtos/IListRentalsDTO';
import { IPaginationResponseDTO } from '../../dtos/IPaginationResponseDTO';

@injectable()
export class ListRentalsUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository
  ) {}

  async execute(
    options: IListRentalsDTO
  ): Promise<IPaginationResponseDTO<Rental>> {
    const {
      page = 1,
      perPage = 10,
      order = OrdenationProps.DESC,
      categoryIds,
      status,
      ...rest
    } = options;
    const parsedCategoryIds = categoryIds
      ? (categoryIds as string).split(',').map((id) => id.trim())
      : undefined;
    const parsedStatus =
      typeof status === 'string'
        ? (status as string).split(',').map((stat) => stat.trim())
        : status;
    const rentals = await this.rentalRepository.list({
      page,
      perPage,
      order,
      categoryIds: parsedCategoryIds,
      status: parsedStatus,
      ...rest,
    });
    const { total } = rentals;
    const { result: data } = rentals;
    const totalPages = Math.ceil(total / perPage);

    return {
      data,
      total,
      totalPages,
    };
  }
}
