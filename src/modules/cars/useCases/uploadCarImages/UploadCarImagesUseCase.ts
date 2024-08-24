import { inject, injectable } from 'tsyringe';

import { UploadFolder } from '@config/upload';
import { IUploadCarImagesDTO } from '@modules/cars/dtos/IUploadCarImagesDTO';
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UploadCarImagesUseCase {
  constructor(
    @inject('CarImageRepository')
    private carsImageRepository: ICarImageRepository,
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('LoggerProvider')
    private loggerProvider: ILoggerProvider
  ) {}

  async execute(data: IUploadCarImagesDTO): Promise<void> {
    const { carId, images } = data;
    const car = await this.carRepository.findById(carId);

    if (!car) {
      throw new AppError('Car not found', 404);
    }

    if (!Array.isArray(images) || !images.length) {
      throw new AppError('Invalid provided images', 400);
    }

    try {
      const carImagesPromises = images
        .map((file) => file.filename)
        .map(async (image) => {
          this.loggerProvider.log({
            level: 'log',
            message: `saving image ${image} in database`,
            metadata: { image },
          });

          await this.carsImageRepository.create({ carId, image });
          await this.storageProvider.save(image, UploadFolder.CARS);
        });

      await Promise.all(carImagesPromises);
    } catch (error) {
      this.loggerProvider.log({
        level: 'error',
        message: `Failed to upload image: ${error.message || error}`,
        metadata: { error },
      });
      throw new AppError(`Failed to upload image`, 500);
    }
  }
}
