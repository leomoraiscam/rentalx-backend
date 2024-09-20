import { CarStatus } from '../enums/CarStatus';

export interface ICarsModel {
  name: string;
  brand: string;
  dailyRate: number;
  fineAmount: number;
  totalAvailable: number;
  total: number;
  cars: {
    id: string;
    licensePlate: string;
    status: CarStatus;
    specifications: unknown;
    images: unknown;
  }[];
}

export interface IListCarsGroupedByCategoryResponseDTO {
  id: string;
  name: string;
  type: string;
  models: ICarsModel[];
}
