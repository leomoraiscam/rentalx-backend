import { Car } from '@modules/cars/infra/typeorm/entities/Car';

export interface IShowSummaryDetailsRentalDTO {
  id: string;
  car: Car;
  offer: {
    dailies: number;
    quoteCarDailyRate: number;
    total: number;
  };
  withdrawal: Date;
  devolution: Date;
}
