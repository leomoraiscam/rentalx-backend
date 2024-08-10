import { inject, injectable } from 'tsyringe';

import { IUploadCarImagesDTO } from '@modules/cars/dtos/IUploadCarImagesDTO';
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UploadCarImageUseCase {
  constructor(
    @inject('CarImageRepository')
    private carsImageRepository: ICarImageRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute(data: IUploadCarImagesDTO): Promise<void> {
    const { carId, imagesName } = data;
    const car = await this.carRepository.findById(carId);

    if (!car) {
      throw new AppError('Car not found', 404);
    }

    const values = imagesName.map(async (image) => {
      await this.carsImageRepository.create({ carId, imageName: image });
      await this.storageProvider.save(image, 'cars');
    });

    await Promise.all(values);
  }
}
