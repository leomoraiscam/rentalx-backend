import { getRepository, Repository, Connection, getConnection } from 'typeorm';

import { IUploadCarImageDTO } from '@modules/cars/dtos/IUploadCarImageDTO';
import { IUploadCarImagesDTO } from '@modules/cars/dtos/IUploadCarImagesDTO';
import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository';
import { IUpdateCarImageDTO } from '@modules/cars/dtos/IUpdateCarImageDTO';

export class CarImageRepository implements ICarImageRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async findById(id: string): Promise<CarImage | undefined> {
    return this.repository.findOne(id);
  }

  async create(data: IUploadCarImageDTO): Promise<CarImage> {
    const { carId, imageName } = data;
    const carImage = this.repository.create({
      carId,
      imageName,
    });

    await this.repository.save(carImage);

    return carImage;
  }

  async createMany(data: IUploadCarImagesDTO): Promise<CarImage[]> {
    const { carId, fileNames } = data;

    return this.repository.manager.transaction(
      async (transactionEntityManager) => {
        const carImagesEntities = fileNames.map((imageName) => {
          return transactionEntityManager.create(CarImage, {
            carId,
            imageName,
          });
        });

        return transactionEntityManager.save(carImagesEntities);
      }
    );
  }

  async replaceImages(data: IUploadCarImagesDTO): Promise<void> {
    const { carId, fileNames } = data;

    await this.repository.manager.transaction(
      async (transactionEntityManager) => {
        await transactionEntityManager.delete(CarImage, { car: { id: carId } });

        const newImages = fileNames.map((imageName) => {
          return transactionEntityManager.create(CarImage, {
            car: { id: carId },
            imageName,
          });
        });

        await transactionEntityManager.save(newImages);
      }
    );
  }

  async update(data: IUpdateCarImageDTO): Promise<void> {
    const { imageId, fileName } = data;

    await this.repository.update(imageId, { imageName: fileName });
  }

  async deleteByCarId(carId: string): Promise<void> {
    await this.repository.delete({ carId });
  }
}
