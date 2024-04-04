import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';

import { ListCategoriesUseCase } from './ListCategoriesUseCase';

let inMemoryCategoryRepository: InMemoryCategoryRepository;
let listCategoriesUseCase: ListCategoriesUseCase;

describe('ListCategoriesUseCase', () => {
  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    listCategoriesUseCase = new ListCategoriesUseCase(
      inMemoryCategoryRepository
    );
  });

  it('should be able to return all categories', async () => {
    await inMemoryCategoryRepository.create({
      name: 'SUV',
      description: 'SUV`s cars',
    });
    await inMemoryCategoryRepository.create({
      name: 'Hatch',
      description: 'Hatch`s cars',
    });
    await inMemoryCategoryRepository.create({
      name: 'Sedan',
      description: 'Sedan`s cars',
    });

    const categories = await listCategoriesUseCase.execute();

    expect(categories.length).toEqual(3);
  });
});
