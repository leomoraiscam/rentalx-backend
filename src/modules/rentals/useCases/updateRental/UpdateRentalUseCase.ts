import { inject, injectable } from 'tsyringe';

import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
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
      const dateNow = await this.dateProvider.dateNow();
      const isBefore = await this.dateProvider.compareIfBefore(
        data.startDate,
        dateNow
      );

      if (isBefore) {
        throw new AppError('You cant create an rental on a past date', 403);
      }

      const startDateIsLess8AmHour = this.dateProvider.getHours(data.startDate);
      const startDateIsMore18PmHour = this.dateProvider.getHours(
        data.startDate
      );

      if (
        Number(startDateIsLess8AmHour.substring(0, 2)) < 8 ||
        Number(startDateIsMore18PmHour.substring(0, 2)) > 18
      ) {
        throw new AppError('You can only create rental 8am and 18pm', 403);
      }

      const returnDateIsLess8AmHour = this.dateProvider.getHours(
        data.expectedReturnDate
      );
      const returnDateIsMore18PmHour = this.dateProvider.getHours(
        data.expectedReturnDate
      );

      if (
        Number(returnDateIsLess8AmHour.substring(0, 2)) < 8 ||
        Number(returnDateIsMore18PmHour.substring(0, 2)) > 18
      ) {
        throw new AppError(
          'You can only devolution car between 8am and 18pm',
          403
        );
      }

      const compare = this.dateProvider.compareInHours(
        data.startDate,
        data.expectedReturnDate
      );

      if (compare < minimumHours) {
        throw new AppError('Invalid return time!', 422);
      }

      const dailies = await this.dateProvider.compareInDays(
        data.startDate,
        data.expectedReturnDate
      );

      total = dailies * rental.car.dailyRate;
      rental.total = total;
    }

    if (data.carId && rental.carId !== data.carId) {
      const dailies = await this.dateProvider.compareInDays(
        rental.startDate,
        rental.expectedReturnDate
      );

      const car = await this.carRepository.findById(data.carId);

      total = dailies * car.dailyRate;
      rental.total = total;
    }

    Object.assign(rental, {
      ...data,
    });

    const updatedRental = await this.rentalRepository.save(rental);

    return updatedRental;
  }
}
