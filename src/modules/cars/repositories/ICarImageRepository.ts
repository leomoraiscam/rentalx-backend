import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';

import { IUploadCarImageDTO } from '../dtos/IUploadCarImageDTO';

export interface ICarImageRepository {
  create(data: IUploadCarImageDTO): Promise<CarImage>;
}
