import { inject, injectable } from 'tsyringe';

import { IUploadCarImagesDTO } from '@modules/cars/dtos/IUploadCarImagesDTO';
import { ICarImageRepository } from '@modules/cars/repositories/ICarImageRepository';
import IStorageProvider from '@shared/container/providers/StorageProvider/IStorageProvider';

@injectable()
export class UploadCarImageUseCase {
  constructor(
    @inject('CarImageRepository')
    private carsImageRepository: ICarImageRepository,
    @inject('StorageProvider')
    private storageProvider: IStorageProvider
  ) {}

  async execute({ carId, imagesName }: IUploadCarImagesDTO): Promise<void> {
    const values = imagesName.map(async (image) => {
      await this.carsImageRepository.create({ carId, imageName: image });
      await this.storageProvider.save(image, 'cars');
    });

    await Promise.all(values);
  }
}
