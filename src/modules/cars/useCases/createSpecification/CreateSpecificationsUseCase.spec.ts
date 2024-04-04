import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { AppError } from '@shared/errors/AppError';

import { CreateSpecificationUseCase } from './CreateSpecificationUseCase';

let inMemorySpecificationRepository: InMemorySpecificationRepository;
let createSpecificationUseCase: CreateSpecificationUseCase;

describe('CreateSpecificationUseCase', () => {
  beforeEach(() => {
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    createSpecificationUseCase = new CreateSpecificationUseCase(
      inMemorySpecificationRepository
    );
  });

  it('should be able to create an specification when receive correct data', async () => {
    const specification = await createSpecificationUseCase.execute({
      name: '1.8',
      description: 'cars with 1.8 of potency',
    });

    expect(specification).toHaveProperty('id');
  });

  it('should be not able to create an category when category already exists', async () => {
    await inMemorySpecificationRepository.create({
      name: 'Turbo',
      description: 'car with turbo of standard',
    });

    await expect(
      createSpecificationUseCase.execute({
        name: 'Turbo',
        description: 'car with turbo of standard',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
