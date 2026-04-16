import { inject, injectable } from 'tsyringe';

import { IListRentalsDTO } from '@modules/rentals/dtos/IListRentalsDTO';
import { IListRentalsResponseDTO } from '@modules/rentals/dtos/IListRentalsResponseDTO';
import { RentalMap } from '@modules/rentals/mapper/RentalMap';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IPaginationResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';
import { FindOptionsOrdernation } from '@shared/common/enums/findOptionsOrder';
import { paginationResultQuery } from '@shared/common/helpers/paginationResult.helper';

@injectable()
export class ListRentalsByUserUseCase {
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
      userId,
    } = options;
    const { total, result } = await this.rentalRepository.list({
      userId,
      page,
      perPage,
      order,
    });

    return paginationResultQuery(
      total,
      perPage,
      result.map((rental) => RentalMap.toList(rental))
    );
  }
}
