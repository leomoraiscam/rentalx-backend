import { InMemoryCarImageRepository } from '@modules/cars/repositories/in-memory/InMemoryCarImageRepository';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryLoggerProvider } from '@shared/container/providers/LoggerProvider/in-memory/InMemoryLoggerProvider';
import { InMemoryStorageProvider } from '@shared/container/providers/StorageProvider/in-memory/InMemoryStorageProvider';
import { AppError } from '@shared/errors/AppError';

import { UploadCarImagesUseCase } from './UploadCarImagesUseCase';

describe('UploadCarImagesUseCase', () => {
  let inMemoryCarImageRepository: InMemoryCarImageRepository;
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryStorageProvider: InMemoryStorageProvider;
  let inMemoryLoggerProvider: InMemoryLoggerProvider;
  let uploadCarImagesUseCase: UploadCarImagesUseCase;

  beforeEach(() => {
    inMemoryCarImageRepository = new InMemoryCarImageRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryStorageProvider = new InMemoryStorageProvider();
    inMemoryLoggerProvider = new InMemoryLoggerProvider();
    uploadCarImagesUseCase = new UploadCarImagesUseCase(
      inMemoryCarImageRepository,
      inMemoryCarRepository,
      inMemoryStorageProvider,
      inMemoryLoggerProvider
    );
  });

  it('should be able to upload images to the car when received correct data', async () => {
    const spiedUpload = jest.spyOn(inMemoryStorageProvider, 'save');
    const spiedCreate = jest.spyOn(inMemoryCarImageRepository, 'create');
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
    const images = [
      {
        fieldname: 'images',
        originalname: 'faked-original-name',
        encoding: 'fake-encoding',
        mimetype: 'image/png',
        destination: 'fake-destination',
        filename: 'fake-hashed-filename',
        path: 'fake-path',
        size: 1,
      },
    ] as Express.Multer.File[];

    await uploadCarImagesUseCase.execute({ carId, images });

    expect(spiedUpload).toHaveBeenNthCalledWith(
      1,
      'fake-hashed-filename',
      'cars'
    );
    expect(spiedCreate).toHaveBeenNthCalledWith(1, {
      carId,
      image: 'fake-hashed-filename',
    });
  });

  it('should not be abe to upload images to the car when the same a non-exist', async () => {
    const images = [
      {
        fieldname: 'images',
        originalname: 'faked-original-name',
        encoding: 'fake-encoding',
        mimetype: 'image/png',
        destination: 'fake-destination',
        filename: 'fake-hashed-filename',
        path: 'fake-path',
        size: 1,
      },
    ] as Express.Multer.File[];

    await expect(
      uploadCarImagesUseCase.execute({ carId: 'faked-car-id', images })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to upload images to the car when a non-receive images', async () => {
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
    const images = [] as Express.Multer.File[];

    await expect(
      uploadCarImagesUseCase.execute({ carId, images })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to upload images to the car when carImage repository fails', async () => {
    jest
      .spyOn(inMemoryCarImageRepository, 'create')
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
    const images = [
      {
        fieldname: 'images',
        originalname: 'faked-original-name',
        encoding: 'fake-encoding',
        mimetype: 'image/png',
        destination: 'fake-destination',
        filename: 'fake-hashed-filename',
        path: 'fake-path',
        size: 1,
      },
    ] as Express.Multer.File[];

    await expect(
      uploadCarImagesUseCase.execute({ carId, images })
    ).rejects.toBeInstanceOf(AppError);
    expect(loggerSpied).toHaveBeenCalledTimes(2);
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
    const images = [
      {
        fieldname: 'images',
        originalname: 'faked-original-name',
        encoding: 'fake-encoding',
        mimetype: 'image/png',
        destination: 'fake-destination',
        filename: 'fake-hashed-filename',
        path: 'fake-path',
        size: 1,
      },
    ] as Express.Multer.File[];

    await expect(
      uploadCarImagesUseCase.execute({ carId, images })
    ).rejects.toBeInstanceOf(AppError);
    expect(loggerSpied).toHaveBeenCalledTimes(2);
  });
});
