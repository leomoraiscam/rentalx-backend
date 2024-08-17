import { CategoryType } from '@modules/cars/dtos/ICreateCategoryDTO';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateCarUseCase } from './CreateCarUseCase';

describe('CreateCarUseCase', () => {
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let inMemorySpecificationRepository: InMemorySpecificationRepository;
  let createCarUseCase: CreateCarUseCase;

  beforeEach(() => {
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    createCarUseCase = new CreateCarUseCase(
      inMemoryCarRepository,
      inMemoryCategoryRepository,
      inMemorySpecificationRepository
    );
  });

  it('should be able to create a new car when received correct data', async () => {
    const category = await inMemoryCategoryRepository.create({
      name: 'GROUP L - SPORT',
      description:
        'Designed to optimize aerodynamics, reach higher speeds and offer high performance.',
      type: CategoryType.SPORT,
    });
    const specification = await inMemorySpecificationRepository.create({
      name: 'Turbo',
      description: 'car with turbo of standard',
    });

    const car = await createCarUseCase.execute({
      name: 'A4',
      brand: 'Audi',
      description: 'executive car',
      dailyRate: 120,
      licensePlate: 'ABC-1234',
      fineAmount: 100,
      categoryId: category.id,
      category,
      specifications: [specification],
    });

    expect(car).toHaveProperty('id');
  });

  it('should be able to create a car with correct data', async () => {
    const { id: categoryId } = await inMemoryCategoryRepository.create({
      name: 'GROUP L - SPORT',
      description:
        'Designed to optimize aerodynamics, reach higher speeds and offer high performance.',
      type: CategoryType.SPORT,
    });
    const car = await createCarUseCase.execute({
      name: 'A3',
      brand: 'Audi',
      description: 'executive',
      dailyRate: 120,
      licensePlate: 'JKL-294',
      fineAmount: 100,
      categoryId,
    });

    expect(car).toHaveProperty('id');
  });

  it('should not be able to create a car when already exist license plate', async () => {
    await inMemoryCarRepository.create({
      name: 'Q3',
      brand: 'Audi',
      description: 'SUV car',
      dailyRate: 80,
      licensePlate: 'KMD-143',
      fineAmount: 75,
      categoryId: 'SUV',
    });

    await expect(
      createCarUseCase.execute({
        name: 'Q3',
        brand: 'Audi',
        description: 'SUV car',
        dailyRate: 80,
        licensePlate: 'KMD-143',
        fineAmount: 75,
        categoryId: 'SUV',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
