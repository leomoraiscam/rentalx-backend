import { inject, injectable } from 'tsyringe';

import { IUploadCarImagesDTO } from '@modules/cars/dtos/IUploadCarImagesDTO';
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { UploadFolder } from '@shared/common/enums/uploadFolder';
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
    const { carId, fileNames } = data;
    const car = await this.carRepository.findById(carId);

    if (!car) {
      throw new AppError('Car not found', 404);
    }

    const savedFileNames: string[] = [];

    try {
      const storagePromises = fileNames.map(async (fileName) => {
        await this.storageProvider.save(fileName, UploadFolder.Cars);
        savedFileNames.push(fileName);
      });

      await Promise.all(storagePromises);
      await this.carsImageRepository.createMany({
        carId,
        fileNames: savedFileNames,
      });
    } catch (error) {
      this.loggerProvider.log({
        level: 'error',
        message: `Failed to upload image: ${error?.message}`,
        metadata: { error },
      });

      try {
        const deletePromises = savedFileNames.map((fileName) =>
          this.storageProvider.delete(fileName, UploadFolder.Cars)
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
