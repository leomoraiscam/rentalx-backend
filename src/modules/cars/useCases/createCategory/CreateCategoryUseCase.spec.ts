import { CategoryType } from '@modules/cars/dtos/ICreateCategoryDTO';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateCategoryUseCase } from './CreateCategoryUseCase';

let inMemoryCategoryRepository: InMemoryCategoryRepository;
let createCategoryUseCase: CreateCategoryUseCase;

describe('CreateCategoryUseCase', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    createCategoryUseCase = new CreateCategoryUseCase(
      inMemoryCategoryRepository
    );
  });

  it('should be able to create an category when receive correct data', async () => {
    const category = await createCategoryUseCase.execute({
      name: 'Executive',
      description: 'cars executives',
      type: CategoryType.SEDAN,
    });

    expect(category).toHaveProperty('id');
  });

  it('should be not able to create an category when category already exists', async () => {
    await inMemoryCategoryRepository.create({
      name: 'SUV',
      description: 'SUV`s cars',
      type: CategoryType.SUV,
    });

    await expect(
      createCategoryUseCase.execute({
        name: 'SUV',
        description: 'SUV`s cars',
        type: CategoryType.SUV,
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
