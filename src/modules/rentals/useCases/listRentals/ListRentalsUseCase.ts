import { injectable, inject } from 'tsyringe';

import { IListRentalsResponseDTO } from '@modules/rentals/dtos/IListRentalsResponseDTO';
import { RentalMap } from '@modules/rentals/mapper/RentalMap';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IPaginationResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';
import { FindOptionsOrdernation } from '@shared/common/enums/findOptionsOrder';
import { convertQueryStringToFilterArray } from '@shared/common/helpers/convertQueryStringToFilterArray';
import { paginationResultQuery } from '@shared/common/helpers/paginationResult.helper';

import { IListRentalsDTO } from '../../dtos/IListRentalsDTO';

@injectable()
export class ListRentalsUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository
  ) {}

  async execute(
    options: IListRentalsDTO
  ): Promise<IPaginationResponseDTO<IListRentalsResponseDTO>> {
    const {
      page = 1,
      perPage = 10,
      order = FindOptionsOrdernation.Desc,
      categoryIds,
      status,
      ...rest
    } = options;
    const parsedCategoryIds = convertQueryStringToFilterArray(
      categoryIds as string
    );
    const parsedStatus = convertQueryStringToFilterArray(status);

    const { total, result } = await this.rentalRepository.list({
      page,
      perPage,
      order,
      categoryIds: parsedCategoryIds,
      status: parsedStatus,
      ...rest,
    });

    return paginationResultQuery(
      total,
      perPage,
      result.map((rental) => RentalMap.toList(rental))
    );
  }
}
