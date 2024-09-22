import { CarStatus } from '../enums/CarStatus';
import { CarImage } from '../infra/typeorm/entities/CarImage';
import { Specification } from '../infra/typeorm/entities/Specification';
import { IGroupedCarsModelsDTO } from './IGroupedCarsModelsDTO';

export interface IGroupedCarsWithOptionsDTO extends IGroupedCarsModelsDTO {
  cars: Array<{
    id: string;
    licensePlate: string;
    status: CarStatus;
    specifications: Specification[];
    images: CarImage[];
  }>;
}

export interface IListCarsByCategoryResponseDTO {
  id: string;
  name: string;
  type: string;
  models: IGroupedCarsWithOptionsDTO[];
}
