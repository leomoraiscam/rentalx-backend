import { InMemoryCarImageRepository } from '@modules/cars/repositories/in-memory/InMemoryCarImageRepository';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryStorageProvider } from '@shared/container/providers/StorageProvider/in-memory/InMemoryStorageProvider';

import { UploadCarImageUseCase } from './UploadCarImagesUseCase';

let inMemoryCarImageRepository: InMemoryCarImageRepository;
let inMemoryCarRepository: InMemoryCarRepository;
let inMemoryStorageProvider: InMemoryStorageProvider;
let uploadCarImageUseCase: UploadCarImageUseCase;

describe('UploadCarImagesUseCase', () => {
  beforeEach(() => {
    inMemoryCarImageRepository = new InMemoryCarImageRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryStorageProvider = new InMemoryStorageProvider();
    uploadCarImageUseCase = new UploadCarImageUseCase(
      inMemoryCarImageRepository,
      inMemoryCarRepository,
      inMemoryStorageProvider
    );
  });

  it('should be able to upload car images', async () => {
    const { id: carId } = await inMemoryCarRepository.create({
      name: 'Mustang',
      brand: 'Ford',
      description: 'Ford Mustang',
      dailyRate: 400,
      licensePlate: 'DJA-002',
      fineAmount: 400,
      categoryId: 'fake-category-id',
    });

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
    const { id: carId } = await inMemoryCarRepository.create({
      name: 'Mustang',
      brand: 'Ford',
      description: 'Ford Mustang',
      dailyRate: 400,
      licensePlate: 'DJA-002',
      fineAmount: 400,
      categoryId: 'fake-category-id',
    });

    const imagesName: string[] = [];

    await uploadCarImageUseCase.execute({ carId, imagesName });

    const carImages = await inMemoryCarImageRepository.listByCarId(carId);

    expect(carImages).toHaveLength(0);
  });
});
