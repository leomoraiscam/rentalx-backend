import { InMemoryCarAvailabilityRepository } from '@modules/cars/repositories/in-memory/InMemoryCarAvailabilityRepository';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateInventoryToCarsUseCase } from './CreateInventoryToCarsUseCase';

let inMemoryCarRepository: InMemoryCarRepository;
let inMemoryCarAvailabilityRepository: InMemoryCarAvailabilityRepository;
let createInventoryToCarsUseCase: CreateInventoryToCarsUseCase;

describe('CreateInventoryToCarsUseCase', () => {
  beforeEach(() => {
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryCarAvailabilityRepository = new InMemoryCarAvailabilityRepository();
    createInventoryToCarsUseCase = new CreateInventoryToCarsUseCase(
      inMemoryCarRepository,
      inMemoryCarAvailabilityRepository
    );
  });

  it('should be able to create inventory to distinct cars', async () => {
    const { id: carId01 } = await inMemoryCarRepository.create({
      name: 'Lancer',
      brand: 'Mitsubishi',
      description: 'sedan sportive',
      dailyRate: 180,
      licensePlate: 'ABC-124',
      fineAmount: 120,
      categoryId: 'sedan sportive',
    });

    const { id: carId02 } = await inMemoryCarRepository.create({
      name: 'A4',
      brand: 'Audi',
      description: 'executive car',
      dailyRate: 120,
      licensePlate: 'ABC-1234',
      fineAmount: 100,
      categoryId: 'executive',
    });

    const { id: carId03 } = await inMemoryCarRepository.create({
      name: 'Q3',
      brand: 'Audi',
      description: 'SUV car',
      dailyRate: 80,
      licensePlate: 'KMD-143',
      fineAmount: 75,
      categoryId: 'SUV',
    });

    const availabilitiesCarQuantity = await createInventoryToCarsUseCase.execute(
      {
        inventory: [
          {
            carId: carId01,
            quantity: 3,
          },
          {
            carId: carId02,
            quantity: 4,
          },
          {
            carId: carId03,
            quantity: 1,
          },
        ],
      }
    );

    expect(availabilitiesCarQuantity[0]).toHaveProperty('id');
  });

  it('should not be able to create inventory to the cars when has same car id', async () => {
    const { id: carId01 } = await inMemoryCarRepository.create({
      name: 'Lancer',
      brand: 'Mitsubishi',
      description: 'sedan sportive',
      dailyRate: 180,
      licensePlate: 'ABC-124',
      fineAmount: 120,
      categoryId: 'sedan sportive',
    });

    const { id: carId02 } = await inMemoryCarRepository.create({
      name: 'A4',
      brand: 'Audi',
      description: 'executive car',
      dailyRate: 120,
      licensePlate: 'ABC-1234',
      fineAmount: 100,
      categoryId: 'executive',
    });

    await expect(
      createInventoryToCarsUseCase.execute({
        inventory: [
          {
            carId: carId01,
            quantity: 3,
          },
          {
            carId: carId02,
            quantity: 4,
          },
          {
            carId: carId01,
            quantity: 1,
          },
        ],
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create inventory when a non exist car', async () => {
    const { id: carId01 } = await inMemoryCarRepository.create({
      name: 'Lancer',
      brand: 'Mitsubishi',
      description: 'sedan sportive',
      dailyRate: 180,
      licensePlate: 'ABC-124',
      fineAmount: 120,
      categoryId: 'sedan sportive',
    });

    const { id: carId02 } = await inMemoryCarRepository.create({
      name: 'A4',
      brand: 'Audi',
      description: 'executive car',
      dailyRate: 120,
      licensePlate: 'ABC-1234',
      fineAmount: 100,
      categoryId: 'executive',
    });

    await expect(
      createInventoryToCarsUseCase.execute({
        inventory: [
          {
            carId: carId01,
            quantity: 3,
          },
          {
            carId: carId02,
            quantity: 4,
          },
          {
            carId: 'car-a-non-exist',
            quantity: 1,
          },
        ],
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
