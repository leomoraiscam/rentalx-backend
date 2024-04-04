import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateCarSpecificationsUseCase } from './CreateCarSpecificationUseCase';

let inMemoryCarRepository: InMemoryCarRepository;
let inMemorySpecificationRepository: InMemorySpecificationRepository;
let createCarSpecificationsUseCase: CreateCarSpecificationsUseCase;

describe('CreateCarSpecifications', () => {
  beforeEach(() => {
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    createCarSpecificationsUseCase = new CreateCarSpecificationsUseCase(
      inMemoryCarRepository,
      inMemorySpecificationRepository
    );
  });

  it('should be able to create a new specification to the car', async () => {
    const { id: carId } = await inMemoryCarRepository.create({
      name: 'Lancer',
      brand: 'Mitsubishi',
      description: 'sedan sportive',
      dailyRate: 180,
      licensePlate: 'ABC-124',
      fineAmount: 120,
      categoryId: 'sedan sportive',
    });

    const specification = await inMemorySpecificationRepository.create({
      description: 'turbo',
      name: 'turbo car`s',
    });

    const specificationsIds = [specification.id];

    const specificationsCars = await createCarSpecificationsUseCase.execute({
      carId,
      specificationsIds,
    });

    expect(specificationsCars).toHaveProperty('specifications');
  });

  it('should not be able to create specifications when a non exist car', async () => {
    const specification = await inMemorySpecificationRepository.create({
      description: 'Manual',
      name: 'manual transmission shifter',
    });

    const specificationsIds = [specification.id];

    await expect(
      createCarSpecificationsUseCase.execute({
        carId: 'a-non-exist-car',
        specificationsIds,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
