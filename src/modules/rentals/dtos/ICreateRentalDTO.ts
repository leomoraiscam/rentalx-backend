import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

export interface ICreateRentalDTO {
  userId: string;
  user?: User;
  carId: string;
  expectedReturnDate: Date;
  startDate: Date;
  id?: string;
  endDate?: Date;
  total?: number;
  status?: string;
  car?: Car;
}
