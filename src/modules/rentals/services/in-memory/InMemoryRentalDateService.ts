import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { IRentalDateService } from '@modules/rentals/services/IRentalDateService';
import { AppError } from '@shared/errors/AppError';

export class InMemoryRentalDateService implements IRentalDateService {
  private MIN_APPOINTMENT_HOUR = 8;
  private MAX_APPOINTMENT_HOUR = 18;
  private ONE_DAY_IN_MILLISECONDS = 86_400_000;

  validateStartDate(startDate: Date): void {
    const now = new Date();

    if (startDate < now) {
      throw new AppError('Cannot start a rental in the past', 422);
    }
  }

  validateRentalHours(date: Date): void {
    const hour = date.getUTCHours();

    if (hour < this.MIN_APPOINTMENT_HOUR || hour > this.MAX_APPOINTMENT_HOUR) {
      throw new AppError('Rental hours must be between 8am and 6pm', 422);
    }
  }

  validateRentalDuration(startDate: Date, endDate: Date): void {
    const ONE_DAY_IN_MILLISECONDS = 86_400_000;
    const duration = endDate.getTime() - startDate.getTime();

    if (duration < ONE_DAY_IN_MILLISECONDS) {
      throw new AppError('Invalid return time!', 422);
    }
  }

  calculateTotal(car: Car, startDate: Date, expectedReturnDate: Date): number {
    const rentalDays = Math.ceil(
      (expectedReturnDate.getTime() - startDate.getTime()) /
        this.ONE_DAY_IN_MILLISECONDS
    );
    return rentalDays * car.dailyRate;
  }
}
