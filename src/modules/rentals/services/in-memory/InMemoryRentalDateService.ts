import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { IRentalDateService } from '@modules/rentals/services/IRentalDateService';
import { AppError } from '@shared/errors/AppError';

export class InMemoryRentalDateService implements IRentalDateService {
  validateStartDate(startDate: Date): void {
    const now = new Date();

    if (startDate < now) {
      throw new AppError('Cannot start a rental in the past');
    }
  }

  validateRentalHours(date: Date): void {
    const hour = date.getUTCHours();

    if (hour < 8 || hour > 18) {
      throw new AppError('Rental hours must be between 8am and 6pm');
    }
  }

  calculateTotal(car: Car, startDate: Date, expectedReturnDate: Date): number {
    const rentalDays = Math.ceil(
      (expectedReturnDate.getTime() - startDate.getTime()) /
        (1000 * 60 * 60 * 24)
    );
    return rentalDays * car.dailyRate;
  }
}
