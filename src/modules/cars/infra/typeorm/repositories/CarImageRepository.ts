import { getRepository, Repository } from 'typeorm';

import { IUploadCarImageDTO } from '@modules/cars/dtos/IUploadCarImageDTO';
import { CarImage } from '@modules/cars/infra/typeorm/entities/CarImage';
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository';

export class CarImageRepository implements ICarImageRepository {
  private repository: Repository<CarImage>;

  constructor() {
    this.repository = getRepository(CarImage);
  }

  async create({ carId, imageName }: IUploadCarImageDTO): Promise<CarImage> {
    const carImage = this.repository.create({
      carId,
      imageName,
    });

    await this.repository.save(carImage);

    return carImage;
  }
}
