import { CarImage } from '../infra/typeorm/entities/CarImage';
import { Specification } from '../infra/typeorm/entities/Specification';
import { IGroupedCarsModelsDTO } from './IGroupedCarsModelsDTO';

export interface ICarModelsDTO extends IGroupedCarsModelsDTO {
  description: string;
  specifications: Specification[];
  images: CarImage[];
}

export interface IListCategoriesWithModelsResponseDTO {
  id: string;
  name: string;
  type: string;
  models: ICarModelsDTO[];
  available: boolean;
}
