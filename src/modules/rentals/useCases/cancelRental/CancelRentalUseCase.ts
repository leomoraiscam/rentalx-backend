import { inject, injectable } from 'tsyringe';

import { CarStatus } from '@modules/cars/enums/carStatus';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { RentalStatus } from '@modules/rentals/enums/rentalStatus';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class CancelRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository
  ) {}

  async execute(id: string, userId: string): Promise<void> {
    const rental = await this.rentalRepository.findById(id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    if (!rental.status.includes(RentalStatus.Confirmed)) {
      throw new AppError(
        'The rent cannot be cancelled as it has passed the period',
        422
      );
    }

    if (rental.userId !== userId) {
      throw new AppError(
        'You cannot cancel a rental that belongs to another user.',
        403
      );
    }

    const car = await this.carRepository.findById(rental.carId);

    car.status = CarStatus.Available;
    rental.status = RentalStatus.Cancelled;

    await Promise.all([
      this.rentalRepository.save(rental),
      this.carRepository.save(car),
    ]);
  }
}
