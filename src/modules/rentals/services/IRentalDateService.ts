import { Car } from '@modules/cars/infra/typeorm/entities/Car';

export interface IRentalDateService {
  validateRentalHours(date: Date): void;
  validateStartDate(startDate: Date): void;
  calculateTotal(car: Car, startDate: Date, endDate: Date): number;
}
