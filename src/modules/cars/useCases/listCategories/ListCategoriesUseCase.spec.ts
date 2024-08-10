import { CategoryType } from '@modules/cars/dtos/ICreateCategoryDTO';
import { OrdenationProps } from '@modules/cars/dtos/IQueryListCategoriesDTO';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';

import { ListCategoriesUseCase } from './ListCategoriesUseCase';

describe('ListCategoriesUseCase', () => {
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let listCategoriesUseCase: ListCategoriesUseCase;

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
      type: CategoryType.SUV,
    });
    await inMemoryCategoryRepository.create({
      name: 'Hatch',
      description: 'Hatch`s cars',
      type: CategoryType.HATCH,
    });
    await inMemoryCategoryRepository.create({
      name: 'Sedan',
      description: 'Sedan`s cars',
      type: CategoryType.SEDAN,
    });

    const categories = await listCategoriesUseCase.execute({
      page: 1,
      perPage: 10,
      order: OrdenationProps.ASC,
    });

    expect(categories.data.length).toEqual(3);
  });
});
