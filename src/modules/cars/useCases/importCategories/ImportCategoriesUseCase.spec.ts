import { InMemoryCSVStreamParserProvider } from '@shared/container/providers/CSVStreamParserProvider/in-memory/InMemoryCSVStreamParserProvider';

import { InMemoryCategoryRepository } from '../../repositories/in-memory/InMemoryCategoryRepository';
import { ImportCategoriesUseCase } from './ImportCategoriesUseCase';

describe('ImportCategoryUseCase', () => {
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let inMemoryCSVStreamParseProvider: InMemoryCSVStreamParserProvider;
  let importCategoriesUseCase: ImportCategoriesUseCase;

  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemoryCSVStreamParseProvider = new InMemoryCSVStreamParserProvider();
    importCategoriesUseCase = new ImportCategoriesUseCase(
      inMemoryCategoryRepository,
      inMemoryCSVStreamParseProvider
    );
  });

  it('should be able to import all categories when a non exist categories registered', async () => {
    const spiedFindByNameOfCategoryRepository = jest.spyOn(
      inMemoryCategoryRepository,
      'findByName'
    );
    const spiedCreateOfCategoryRepository = jest.spyOn(
      inMemoryCategoryRepository,
      'create'
    );
    const spiedInMemoryCSVStreamParseProvider = jest.spyOn(
      inMemoryCSVStreamParseProvider,
      'parse'
    );
    const file = { path: 'fake/path.csv' } as Express.Multer.File;

    await importCategoriesUseCase.execute(file);

    expect(spiedInMemoryCSVStreamParseProvider).toHaveBeenCalledWith(
      file.path,
      ['name', 'description', 'type']
    );
    expect(spiedFindByNameOfCategoryRepository).toHaveBeenNthCalledWith(
      2,
      'Category 2'
    );
    expect(spiedCreateOfCategoryRepository).toHaveBeenNthCalledWith(2, {
      description: 'Description 2',
      name: 'Category 2',
      type: 'Type 2',
    });
  });

  it('should be able to import some categories when registered categories already exist', async () => {
    const spiedFindByNameOfCategoryRepository = jest.spyOn(
      inMemoryCategoryRepository,
      'findByName'
    );
    spiedFindByNameOfCategoryRepository.mockResolvedValueOnce({
      description: 'Description 1',
      name: 'Category 1',
      type: 'Type 1',
      createdAt: new Date(2024, 1, 1),
      id: 'faked-id',
    });
    const spiedCreateOfCategoryRepository = jest.spyOn(
      inMemoryCategoryRepository,
      'create'
    );
    const spiedInMemoryCSVStreamParseProvider = jest.spyOn(
      inMemoryCSVStreamParseProvider,
      'parse'
    );
    const file = { path: 'fake/path.csv' } as Express.Multer.File;

    await importCategoriesUseCase.execute(file);

    expect(spiedInMemoryCSVStreamParseProvider).toHaveBeenCalledWith(
      file.path,
      ['name', 'description', 'type']
    );
    expect(spiedFindByNameOfCategoryRepository).toHaveBeenNthCalledWith(
      2,
      'Category 2'
    );
    expect(spiedCreateOfCategoryRepository).toHaveBeenNthCalledWith(1, {
      description: 'Description 2',
      name: 'Category 2',
      type: 'Type 2',
    });
  });
});
