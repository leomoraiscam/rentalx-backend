import { inject, injectable } from 'tsyringe';

import { RentalStatus } from '@modules/rentals/dtos/enums/RentatStatus';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UpdateStatusRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository
  ) {}

  async execute(id: string): Promise<Rental> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    Object.assign(rental, {
      status: RentalStatus.CONFIRMED,
    });

    return this.rentalRepository.save(rental);
  }
}
