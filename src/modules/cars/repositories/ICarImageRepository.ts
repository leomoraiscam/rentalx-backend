import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';

import { IUploadCarImageDTO } from '../dtos/IUploadCarImageDTO';
import { IUploadCarImagesDTO } from '../dtos/IUploadCarImagesDTO';
import { IUpdateCarImageDTO } from '../dtos/IUpdateCarImageDTO';

export interface ICarImageRepository {
  findById(id: string): Promise<CarImage | undefined>;
  create(data: IUploadCarImageDTO): Promise<CarImage>;
  createMany(data: IUploadCarImagesDTO): Promise<CarImage[]>;
  update(data: IUpdateCarImageDTO): Promise<void>;
  deleteByCarId(carId: string): Promise<void>;
  replaceImages(data: IUploadCarImagesDTO): Promise<void>;
}
