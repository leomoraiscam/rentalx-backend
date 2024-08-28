import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class RentalDateService {
  constructor(
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  validateRentalHours(date: Date): void {
    const hour = Number(this.dateProvider.getHours(date).slice(0, 2));

    if (hour < 8 || hour > 18) {
      throw new AppError(
        'Rentals can only be scheduled between 8am and 6pm',
        422
      );
    }
  }

  validateStartDate(startDate: Date): void {
    const dateNow = this.dateProvider.dateNow();
    const isBefore = this.dateProvider.compareIfBefore(startDate, dateNow);

    if (isBefore) {
      throw new AppError('You can’t create a rental on a past date', 422);
    }
  }

  calculateTotal(car: Car, startDate: Date, endDate: Date): number {
    const days = this.dateProvider.compareInDays(startDate, endDate);
    return days * car.dailyRate;
  }
}
