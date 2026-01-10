import { Rental } from '../infra/typeorm/entities/Rental';

export interface IDevolutionRentalDTO {
  rental: Rental;
  daysRented: number;
  daysOverdue: number;
  fine: number;
  total: number;
}
