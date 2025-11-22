import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryLoggerProvider } from '@shared/container/providers/LoggerProvider/in-memory/InMemoryLoggerProvider';
import { InMemoryStorageProvider } from '@shared/container/providers/StorageProvider/in-memory/InMemoryStorageProvider';
import { AppError } from '@shared/errors/AppError';

import { InMemoryCarImageRepository } from '../../repositories/in-memory/InMemoryCarImageRepository';
import { UpdateCarImagesUseCase } from './UpdateCarImagesUseCase';

describe('UpdateCarImagesUseCase', () => {
  let updateCarImagesUseCase: UpdateCarImagesUseCase;
  let inMemoryStorageProvider: InMemoryStorageProvider;
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryCarImageRepository: InMemoryCarImageRepository;
  let inMemoryLoggerProvider: InMemoryLoggerProvider;

  beforeEach(() => {
    inMemoryCarImageRepository = new InMemoryCarImageRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryStorageProvider = new InMemoryStorageProvider();
    inMemoryLoggerProvider = new InMemoryLoggerProvider();
    updateCarImagesUseCase = new UpdateCarImagesUseCase(
      inMemoryCarImageRepository,
      inMemoryCarRepository,
      inMemoryStorageProvider,
      inMemoryLoggerProvider
    );
  });

  it('should be able to update all images when a car has set images configuration', async () => {
    const spiedSaveUploadFile = jest.spyOn(inMemoryStorageProvider, 'save');
    const spiedDeletedUploadFile = jest.spyOn(
      inMemoryStorageProvider,
      'delete'
    );

    const spiedCreate = jest.spyOn(inMemoryCarImageRepository, 'createMany');
    const { id: carId } = await inMemoryCarRepository.create({
      name: 'Mustang',
      brand: 'Ford',
      description: 'Ford Mustang',
      dailyRate: 400,
      licensePlate: 'DJA-002',
      fineAmount: 400,
      categoryId: 'fake-category-id',
      specifications: [
        {
          id: 'fake-id',
          createdAt: new Date(),
          description: 'fake-description',
          name: 'fake-name',
        },
      ],
      images: [
        {
          imageName: 'img-1',
          id: 'faked-id',
          carId: 'faked-car-id',
          createdAt: new Date(),
        },
        {
          imageName: 'img-2',
          id: 'faked-id',
          carId: 'faked-car-id',
          createdAt: new Date(),
        },
      ],
    });
    await updateCarImagesUseCase.execute({
      carId,
      fileNames: ['update-fake-hashed-filename'],
    });

    expect(spiedSaveUploadFile).toHaveBeenNthCalledWith(
      1,
      'update-fake-hashed-filename',
      'cars'
    );
    expect(spiedDeletedUploadFile).toHaveBeenNthCalledWith(1, 'img-1', 'cars');
    expect(spiedDeletedUploadFile).toHaveBeenNthCalledWith(2, 'img-2', 'cars');
    expect(spiedCreate).toHaveBeenNthCalledWith(1, {
      carId,
      fileNames: ['update-fake-hashed-filename'],
    });
  });

  it('should be able to set received images when a car hasnt set images configuration', async () => {
    const spiedSaveUploadFile = jest.spyOn(inMemoryStorageProvider, 'save');
    const spiedDeletedUploadFile = jest.spyOn(
      inMemoryStorageProvider,
      'delete'
    );

    const spiedCreate = jest.spyOn(inMemoryCarImageRepository, 'createMany');
    const { id: carId } = await inMemoryCarRepository.create({
      name: 'Mustang',
      brand: 'Ford',
      description: 'Ford Mustang',
      dailyRate: 400,
      licensePlate: 'DJA-002',
      fineAmount: 400,
      categoryId: 'fake-category-id',
      specifications: [
        {
          id: 'fake-id',
          createdAt: new Date(),
          description: 'fake-description',
          name: 'fake-name',
        },
      ],
      images: [],
    });
    await updateCarImagesUseCase.execute({
      carId,
      fileNames: ['update-fake-hashed-filename'],
    });

    expect(spiedSaveUploadFile).toHaveBeenNthCalledWith(
      1,
      'update-fake-hashed-filename',
      'cars'
    );
    expect(spiedDeletedUploadFile).toHaveBeenCalledTimes(0);
    expect(spiedCreate).toHaveBeenNthCalledWith(1, {
      carId,
      fileNames: ['update-fake-hashed-filename'],
    });
  });

  it('should not be abe to upload images to the car when the same a non-exist', async () => {
    await expect(
      updateCarImagesUseCase.execute({
        carId: 'faked-car-id',
        fileNames: ['fake-hashed-filename'],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to upload images to the car when carImage repository fails', async () => {
    jest
      .spyOn(inMemoryCarImageRepository, 'createMany')
      .mockRejectedValueOnce(new Error());
    const loggerSpied = jest.spyOn(inMemoryLoggerProvider, 'log');
    const { id: carId } = await inMemoryCarRepository.create({
      name: 'Mustang',
      brand: 'Ford',
      description: 'Ford Mustang',
      dailyRate: 400,
      licensePlate: 'DJA-002',
      fineAmount: 400,
      categoryId: 'fake-category-id',
      specifications: [
        {
          id: 'fake-id',
          createdAt: new Date(),
          description: 'fake-description',
          name: 'fake-name',
        },
      ],
      images: [
        {
          imageName: 'img-1',
          id: 'faked-id',
          carId: 'faked-car-id',
          createdAt: new Date(),
        },
        {
          imageName: 'img-2',
          id: 'faked-id',
          carId: 'faked-car-id',
          createdAt: new Date(),
        },
      ],
    });

    await expect(
      updateCarImagesUseCase.execute({
        carId,
        fileNames: ['fake-hashed-filename'],
      })
    ).rejects.toBeInstanceOf(AppError);
    expect(loggerSpied).toHaveBeenCalledTimes(1);
  });

  it('should not be able to upload images to the car when storage provider fails', async () => {
    jest
      .spyOn(inMemoryStorageProvider, 'save')
      .mockRejectedValueOnce(new Error());
    const loggerSpied = jest.spyOn(inMemoryLoggerProvider, 'log');
    const { id: carId } = await inMemoryCarRepository.create({
      name: 'Mustang',
      brand: 'Ford',
      description: 'Ford Mustang',
      dailyRate: 400,
      licensePlate: 'DJA-002',
      fineAmount: 400,
      categoryId: 'fake-category-id',
      specifications: [
        {
          id: 'fake-id',
          createdAt: new Date(),
          description: 'fake-description',
          name: 'fake-name',
        },
      ],
    });

    await expect(
      updateCarImagesUseCase.execute({
        carId,
        fileNames: ['fake-hashed-filename'],
      })
    ).rejects.toBeInstanceOf(AppError);
    expect(loggerSpied).toHaveBeenCalledTimes(1);
  });
});
