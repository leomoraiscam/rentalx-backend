import { CarStatus } from '../enums/carStatus';
import { CarImage } from '../infra/typeorm/entities/CarImage';
import { Specification } from '../infra/typeorm/entities/Specification';
import { IGroupedCarsModelsDTO } from './IGroupedCarsModelsDTO';

interface ICarDetailsDTO {
  id: string;
  licensePlate: string;
  status: CarStatus;
  specifications: Specification[];
  images: CarImage[];
}

export interface IGroupedCarsWithOptionsDTO extends IGroupedCarsModelsDTO {
  cars: ICarDetailsDTO[];
}

export interface IListCarsByCategoryResponseDTO {
  id: string;
  name: string;
  type: string;
  models: IGroupedCarsWithOptionsDTO[];
}
