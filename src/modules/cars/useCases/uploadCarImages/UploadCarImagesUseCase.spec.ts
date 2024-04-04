import { InMemoryCarImageRepository } from '@modules/cars/repositories/in-memory/InMemoryCarImageRepository';
import { InMemoryStorageProvider } from '@shared/container/providers/StorageProvider/in-memory/InMemoryStorageProvider';

import { UploadCarImageUseCase } from './UploadCarImagesUseCase';

let inMemoryCarImageRepository: InMemoryCarImageRepository;
let inMemoryStorageProvider: InMemoryStorageProvider;
let uploadCarImageUseCase: UploadCarImageUseCase;

describe('UploadCarImagesUseCase', () => {
  beforeEach(() => {
    inMemoryCarImageRepository = new InMemoryCarImageRepository();
    inMemoryStorageProvider = new InMemoryStorageProvider();
    uploadCarImageUseCase = new UploadCarImageUseCase(
      inMemoryCarImageRepository,
      inMemoryStorageProvider
    );
  });

  it('should be able to upload car images', async () => {
    const carId = 'fake-car-id';
    const imagesName = ['image1.jpg', 'image2.jpg'];

    await uploadCarImageUseCase.execute({ carId, imagesName });

    const carImages = await inMemoryCarImageRepository.listByCarId(carId);

    expect(carImages).toHaveLength(2);
    expect(carImages).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ imageName: 'image1.jpg' }),
        expect.objectContaining({ imageName: 'image2.jpg' }),
      ])
    );
  });

  it('should be able to return empty array when not receive images', async () => {
    const carId = 'fake-image-id';
    const imagesName: string[] = [];

    await uploadCarImageUseCase.execute({ carId, imagesName });

    const carImages = await inMemoryCarImageRepository.listByCarId(carId);

    expect(carImages).toHaveLength(0);
  });
});
