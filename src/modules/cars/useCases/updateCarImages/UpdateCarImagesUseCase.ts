import { inject, injectable } from 'tsyringe';

import { UploadFolder } from '@config/upload';
import { IUploadCarImagesDTO } from '@modules/cars/dtos/IUploadCarImagesDTO';
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UpdateCarImagesUseCase {
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
    const { carId, fileNames } = data;

    const car = await this.carRepository.findById(carId);

    if (!car) {
      throw new AppError('Car not found', 404);
    }

    const oldFileNamesToDelete =
      car.images && car.images.length > 0
        ? car.images.map((carImage) => carImage.imageName)
        : [];

    const savedFileNames: string[] = [];

    try {
      const uploadFilePromises = fileNames.map(async (fileName) => {
        await this.storageProvider.save(fileName, UploadFolder.CARS);
        savedFileNames.push(fileName);
      });

      await Promise.all(uploadFilePromises);

      await this.carsImageRepository.replaceImages({
        carId,
        fileNames: savedFileNames,
      });

      if (oldFileNamesToDelete.length > 0) {
        const deleteStoragePromises = oldFileNamesToDelete.map(
          async (imageName) => {
            await this.storageProvider.delete(imageName, UploadFolder.CARS);
          }
        );
        await Promise.all(deleteStoragePromises);
      }
    } catch (err) {
      this.loggerProvider.log({
        level: 'error',
        message: `Failed to upload image: ${err?.message}`,
        metadata: { err },
      });

      try {
        const deletePromises = savedFileNames.map((fileName) =>
          this.storageProvider.delete(fileName, UploadFolder.CARS)
        );
        await Promise.all(deletePromises);
      } catch (err) {
        this.loggerProvider.log({
          level: 'error',
          message: `Rollback failed`,
          metadata: { error: err },
        });
      }

      throw new AppError(`Failed to upload image`, 500);
    }
  }
}
