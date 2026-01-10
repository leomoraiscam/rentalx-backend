import { inject, injectable } from 'tsyringe';

import { IDetailRentalResponseDTO } from '@modules/rentals/dtos/IDetailRentalResponseDTO';
import { RentalMap } from '@modules/rentals/mapper/RentalMap';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class DetailRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(id: string): Promise<IDetailRentalResponseDTO> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    return RentalMap.toDetail(rental);
  }
}
