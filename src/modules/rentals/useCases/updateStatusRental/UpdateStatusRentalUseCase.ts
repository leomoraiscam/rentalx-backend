import { inject, injectable } from 'tsyringe';

import { RentalStatus } from '@modules/rentals/dtos/enums/RentatStatus';
import { IUpdateStatusRentalDTO } from '@modules/rentals/dtos/IUpdateStatusRentalUseCaseDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UpdateStatusRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository
  ) {}

  async execute(data: IUpdateStatusRentalDTO): Promise<Rental> {
    let statusToSave: string;
    const { id, status } = data;
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    if (Object.values(RentalStatus).includes(status)) {
      statusToSave = status as RentalStatus;
    }

    Object.assign(rental, {
      status: statusToSave,
    });

    return this.rentalRepository.save(rental);
  }
}
