import { Car } from '@modules/cars/infra/typeorm/entities/Car';

export interface ICreateRentalDTO {
  userId: string;
  carId: string;
  expectedReturnDate: Date;
  startDate: Date;
  id?: string;
  endDate?: Date;
  total?: number;
  status?: string;
  car?: Car;
}
