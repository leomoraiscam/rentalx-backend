import { IUploadCarImageDTO } from '@modules/cars/dtos/IUploadCarImageDTO';
import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';

import { ICarImageRepository } from '../ICarImageRepository';

export class InMemoryCarImageRepository implements ICarImageRepository {
  private carImages: CarImage[] = [];

  async create(data: IUploadCarImageDTO): Promise<CarImage> {
    const { carId, image } = data;

    const carImage = new CarImage();

    Object.assign(carImage, {
      carId,
      imageName: image,
    });

    this.carImages.push(carImage);

    return carImage;
  }
}
