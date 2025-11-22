/* eslint-disable import/no-unresolved */
import { InMemoryCarImageRepository } from '@modules/cars/repositories/in-memory/InMemoryCarImageRepository';
import { InMemoryLoggerProvider } from '@shared/container/providers/LoggerProvider/in-memory/InMemoryLoggerProvider';
import { InMemoryStorageProvider } from '@shared/container/providers/StorageProvider/in-memory/InMemoryStorageProvider';
import { AppError } from '@shared/errors/AppError';

import { UpdateCarImageUseCase } from './UpdateCarImageUseCase';

describe('UpdateCarImageUseCase', () => {
  let updateCarImageUseCase: UpdateCarImageUseCase;
  let inMemoryStorageProvider: InMemoryStorageProvider;
  let inMemoryCarImageRepository: InMemoryCarImageRepository;
  let inMemoryLoggerProvider: InMemoryLoggerProvider;

  beforeEach(() => {
    inMemoryCarImageRepository = new InMemoryCarImageRepository();
    inMemoryStorageProvider = new InMemoryStorageProvider();
    inMemoryLoggerProvider = new InMemoryLoggerProvider();
    updateCarImageUseCase = new UpdateCarImageUseCase(
      inMemoryCarImageRepository,
      inMemoryStorageProvider,
      inMemoryLoggerProvider
    );
  });

  it('should be able to update a specific car image', async () => {
    const spiedUpdate = jest.spyOn(inMemoryCarImageRepository, 'update');
    const spiedSave = jest.spyOn(inMemoryStorageProvider, 'save');
    const spiedDelete = jest.spyOn(inMemoryStorageProvider, 'delete');

    const oldImage = await inMemoryCarImageRepository.create({
      carId: 'fake-car-id',
      imageName: 'old-image.jpg',
    });
    const newFileName = 'new-image.jpg';

    await updateCarImageUseCase.execute({
      carId: oldImage.carId,
      imageId: oldImage.id,
      fileName: newFileName,
    });

    expect(spiedSave).toHaveBeenCalledWith(newFileName, 'cars');
    expect(spiedUpdate).toHaveBeenCalledWith({
      imageId: oldImage.id,
      fileName: newFileName,
    });
    expect(spiedDelete).toHaveBeenCalledWith('old-image.jpg', 'cars');

    const updatedImage = await inMemoryCarImageRepository.findById(oldImage.id);
    expect(updatedImage.imageName).toBe(newFileName);
  });

  it('should throw an error if the image is not found', async () => {
    const spiedSave = jest.spyOn(inMemoryStorageProvider, 'save');
    const spiedDelete = jest.spyOn(inMemoryStorageProvider, 'delete');

    await expect(
      updateCarImageUseCase.execute({
        carId: 'fake-car-id',
        imageId: 'non-existent-id',
        fileName: 'new-image.jpg',
      })
    ).rejects.toEqual(new AppError('Image not found', 404));

    expect(spiedSave).not.toHaveBeenCalled();
    expect(spiedDelete).not.toHaveBeenCalled();
  });

  it('should throw an error if the image does not belong to the car', async () => {
    const oldImage = await inMemoryCarImageRepository.create({
      carId: 'car-A-id',
      imageName: 'old-image.jpg',
    });

    await expect(
      updateCarImageUseCase.execute({
        carId: 'car-B-id',
        imageId: oldImage.id,
        fileName: 'new-image.jpg',
      })
    ).rejects.toEqual(new AppError('Image does not belong to this car', 403));
  });

  it('should perform a rollback if updating the database fails', async () => {
    const spiedSave = jest.spyOn(inMemoryStorageProvider, 'save');
    const spiedDelete = jest.spyOn(inMemoryStorageProvider, 'delete');

    jest
      .spyOn(inMemoryCarImageRepository, 'update')
      .mockRejectedValueOnce(new Error('Database failure'));

    const oldImage = await inMemoryCarImageRepository.create({
      carId: 'fake-car-id',
      imageName: 'old-image.jpg',
    });

    const newFileName = 'new-image.jpg';

    await expect(
      updateCarImageUseCase.execute({
        carId: oldImage.carId,
        imageId: oldImage.id,
        fileName: newFileName,
      })
    ).rejects.toEqual(new AppError('Failed to update image', 500));

    expect(spiedSave).toHaveBeenCalledWith(newFileName, 'cars');
    expect(spiedDelete).toHaveBeenCalledWith(newFileName, 'cars');
    expect(spiedDelete).not.toHaveBeenCalledWith(oldImage.imageName, 'cars');
    const imageInDb = await inMemoryCarImageRepository.findById(oldImage.id);
    expect(imageInDb.imageName).toBe(oldImage.imageName);
  });
});
