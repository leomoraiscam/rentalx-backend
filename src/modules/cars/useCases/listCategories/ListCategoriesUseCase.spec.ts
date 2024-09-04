import { OrdenationProps } from '@modules/cars/dtos/IQueryListOptionsDTO';
import { CategoryType } from '@modules/cars/enums/CategoryType';
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

  it('should be able to return all categories when categories list with success', async () => {
    await Promise.all([
      inMemoryCategoryRepository.create({
        name: 'SUV',
        description: 'SUV`s cars',
        type: CategoryType.SUV,
      }),
      inMemoryCategoryRepository.create({
        name: 'Hatch',
        description: 'Hatch`s cars',
        type: CategoryType.HATCH,
      }),
      inMemoryCategoryRepository.create({
        name: 'Sedan',
        description: 'Sedan`s cars',
        type: CategoryType.SEDAN,
      }),
    ]);

    const { data: categories } = await listCategoriesUseCase.execute({
      page: 1,
      perPage: 10,
      order: OrdenationProps.ASC,
    });

    expect(categories).toHaveLength(3);
    expect(categories).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: 'SUV' }),
        expect.objectContaining({ name: 'Hatch' }),
        expect.objectContaining({ name: 'Sedan' }),
      ])
    );
  });

  it('should be able to return categories in ascending order by default', async () => {
    await Promise.all([
      inMemoryCategoryRepository.create({
        name: 'SUV',
        description: 'SUV cars',
        type: CategoryType.SUV,
      }),
      inMemoryCategoryRepository.create({
        name: 'Sedan',
        description: 'Sedan cars',
        type: CategoryType.SEDAN,
      }),
      inMemoryCategoryRepository.create({
        name: 'Hatch',
        description: 'Hatch cars',
        type: CategoryType.HATCH,
      }),
    ]);

    const { data: categories } = await listCategoriesUseCase.execute({
      page: 1,
      perPage: 10,
      order: OrdenationProps.ASC,
    });

    expect(categories[0].name).toBe('Hatch');
    expect(categories[1].name).toBe('Sedan');
    expect(categories[2].name).toBe('SUV');
  });

  it('should be able to return an empty array if no categories exist', async () => {
    const { data: categories } = await listCategoriesUseCase.execute({
      page: 1,
      perPage: 10,
      order: OrdenationProps.ASC,
    });

    expect(categories).toEqual([]);
  });
});
