import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { RentalStatus } from '../enums/RentatStatus';

export interface ICreateRentalDTO {
  id?: string;
  userId: string;
  user?: User;
  carId: string;
  car?: Car;
  startDate: Date;
  expectedReturnDate: Date;
  endDate?: Date;
  total?: number;
  status?: RentalStatus;
}
