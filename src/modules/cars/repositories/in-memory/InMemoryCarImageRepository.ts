import { IUpdateCarImageDTO } from '@modules/cars/dtos/IUpdateCarImageDTO';
import { IUploadCarImageDTO } from '@modules/cars/dtos/IUploadCarImageDTO';
import { IUploadCarImagesDTO } from '@modules/cars/dtos/IUploadCarImagesDTO';
import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';

import { ICarImageRepository } from '../ICarImageRepository';

export class InMemoryCarImageRepository implements ICarImageRepository {
  private carImages: CarImage[] = [];

  async findById(id: string): Promise<CarImage | undefined> {
    return this.carImages.find((carImage) => carImage.id === id);
  }

  async create(data: IUploadCarImageDTO): Promise<CarImage> {
    const { carId, imageName } = data;
    const carImage = new CarImage();

    Object.assign(carImage, {
      carId,
      imageName,
    });

    this.carImages.push(carImage);

    return carImage;
  }

  async createMany(data: IUploadCarImagesDTO): Promise<CarImage[]> {
    const { carId, fileNames } = data;

    const carImagesEntity = fileNames.map((fileName) => {
      const carImage = new CarImage();

      Object.assign(carImage, { carId, fileName });

      return carImage;
    });

    this.carImages = this.carImages.concat(carImagesEntity);

    return carImagesEntity;
  }

  async update(data: IUpdateCarImageDTO): Promise<void> {
    const { imageId, fileName } = data;

    const carIndex = this.carImages.findIndex(
      (carImage) => carImage.id === imageId
    );

    this.carImages[carIndex].imageName = fileName;
  }

  async deleteByCarId(carId: string): Promise<void> {
    const carIndex = this.carImages.findIndex(
      (carImage) => carImage.carId === carId
    );

    this.carImages.splice(carIndex, 1);
  }
}
