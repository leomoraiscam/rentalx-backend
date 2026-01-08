import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class RentalDateService {
  private MIN_APPOINTMENT_HOUR = 8;
  private MAX_APPOINTMENT_HOUR = 18;

  constructor(
    @inject('DateProvider')
    private dateProvider: IDateProvider
  ) {}

  validateRentalHours(date: Date): void {
    const hoursInDate = this.dateProvider.getHours(date);
    const hour = Number(hoursInDate.slice(0, 2));

    if (hour < this.MIN_APPOINTMENT_HOUR || hour > this.MAX_APPOINTMENT_HOUR) {
      throw new AppError(
        'Rentals can only be scheduled between 8am and 6pm',
        422
      );
    }
  }

  validateStartDate(startDate: Date): void {
    const currentDate = this.dateProvider.dateNow();
    const isBefore = this.dateProvider.compareIfBefore(startDate, currentDate);

    if (isBefore) {
      throw new AppError('You can’t create a rental on a past date', 422);
    }
  }

  calculateTotal(car: Car, startDate: Date, endDate: Date): number {
    const days = this.dateProvider.compareInDays(startDate, endDate);

    return days * car.dailyRate;
  }
}
