import { inject, injectable } from 'tsyringe';

import { IUpdateCarImageDTO } from '@modules/cars/dtos/IUpdateCarImageDTO';
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository';
import { UploadFolder } from '@shared/common/enums/uploadFolder';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';
import { IStorageProvider } from '@shared/container/providers/StorageProvider/models/IStorageProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class UpdateCarImageUseCase {
  constructor(
    @inject('CarImageRepository')
    private carsImageRepository: ICarImageRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider,
    @inject('LoggerProvider')
    private loggerProvider: ILoggerProvider
  ) {}

  async execute(data: IUpdateCarImageDTO): Promise<void> {
    const { carId, imageId, fileName: newFileName } = data;

    const imageToUpdate = await this.carsImageRepository.findById(imageId);

    if (!imageToUpdate) {
      throw new AppError('Image not found', 404);
    }

    if (imageToUpdate.carId !== carId) {
      throw new AppError('Image does not belong to this car', 403);
    }

    const oldFileName = imageToUpdate.imageName;

    try {
      await this.storageProvider.save(newFileName, UploadFolder.Cars);
      await this.carsImageRepository.update({
        imageId,
        fileName: newFileName,
      });
    } catch (err) {
      this.loggerProvider.log({
        level: 'error',
        message: `Failed to update image: ${err?.message}`,
        metadata: { err },
      });

      try {
        await this.storageProvider.delete(newFileName, UploadFolder.Cars);
      } catch (deleteErr) {
        this.loggerProvider.log({
          level: 'error',
          message: `Rollback failed for new file`,
          metadata: { error: deleteErr },
        });
      }

      throw new AppError(`Failed to update image`, 500);
    }

    try {
      await this.storageProvider.delete(oldFileName, UploadFolder.Cars);
    } catch (deleteErr) {
      this.loggerProvider.log({
        level: 'warn',
        message: `Failed to delete old image file during cleanup`,
        metadata: { error: deleteErr, oldFileName },
      });
    }
  }
}
