import { Car } from '@modules/cars/infra/typeorm/entities/Car';

import { RentalStatus } from '../enums/RentatStatus';

export interface IShowRentalDTO {
  id: string;
  car: Car;
  offer: {
    dailies: number;
    total: number;
  };
  withdrawal: Date;
  devolution: Date;
  status: RentalStatus;
}
