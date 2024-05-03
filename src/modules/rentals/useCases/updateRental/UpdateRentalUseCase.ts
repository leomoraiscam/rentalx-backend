import { inject } from 'tsyringe';

import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

export class UpdateRentalUseCase {
  constructor(
    @inject('RentalRepository')
    private rentalRepository: IRentalRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  async execute(data: Partial<Rental>): Promise<Rental> {
    const minimumHours = 24;
    let total = 0;

    const rental = await this.rentalRepository.findById(data.id);

    if (!rental) {
      throw new AppError('Rental not found', 404);
    }

    if (data.startDate || data.expectedReturnDate) {
      const compare = this.dateProvider.compareInHours(
        data.startDate,
        data.expectedReturnDate
      );

      if (compare < minimumHours) {
        throw new AppError('Invalid return time!', 422);
      }
    }

    if (data.carId && rental.carId !== data.carId) {
      const dailies = await this.dateProvider.compareInDays(
        rental.startDate,
        rental.expectedReturnDate
      );

      const car = await this.carRepository.findById(data.carId);

      total = dailies * car.dailyRate;
    }

    Object.assign(rental, {
      ...data,
      total,
    });

    const updatedRental = await this.rentalRepository.save(rental);

    return updatedRental;
  }
}
