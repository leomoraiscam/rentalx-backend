import { injectable, inject } from 'tsyringe';

import { OrdenationProps } from '@modules/rentals/dtos/IQueryListOptionsDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';

import { IListRentalsDTO } from '../../dtos/IListRentalsDTO';
import { IPaginationResponseDTO } from '../../dtos/IPaginationResponseDTO';
import { convertQueryStringToFilterArray } from '../../utils/convertQueryStringToFilterArray';

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

    const parsedCategoryIds = convertQueryStringToFilterArray(
      categoryIds as string
    );
    const parsedStatus = convertQueryStringToFilterArray(status as string[]);
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
