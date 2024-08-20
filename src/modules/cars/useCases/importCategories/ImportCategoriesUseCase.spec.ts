import { InMemoryCSVStreamParserProvider } from '@shared/container/providers/CSVStreamParserProvider/in-memory/InMemoryCSVStreamParserProvider';

import { InMemoryCategoryRepository } from '../../repositories/in-memory/InMemoryCategoryRepository';
import { ImportCategoriesUseCase } from './ImportCategoriesUseCase';

describe('ImportCategoriesUseCase', () => {
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let inMemoryCSVStreamParseProvider: InMemoryCSVStreamParserProvider;
  let importCategoriesUseCase: ImportCategoriesUseCase;
  let spiedFindByName: unknown;
  let spiedCreate: unknown;
  let spiedParserCSV: unknown;

  beforeEach(() => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemoryCSVStreamParseProvider = new InMemoryCSVStreamParserProvider();
    importCategoriesUseCase = new ImportCategoriesUseCase(
      inMemoryCategoryRepository,
      inMemoryCSVStreamParseProvider
    );
    spiedFindByName = jest.spyOn(inMemoryCategoryRepository, 'findByName');
    spiedCreate = jest.spyOn(inMemoryCategoryRepository, 'create');
    spiedParserCSV = jest.spyOn(inMemoryCSVStreamParseProvider, 'parse');
  });

  it('should be able to import all categories when a non exist categories registered', async () => {
    const file = { path: 'fake/path.csv' } as Express.Multer.File;

    await importCategoriesUseCase.execute(file);

    expect(spiedParserCSV).toHaveBeenCalledWith(file.path, [
      'name',
      'description',
      'type',
    ]);
    expect(spiedFindByName).toHaveBeenNthCalledWith(2, 'Category 2');
    expect(spiedCreate).toHaveBeenNthCalledWith(2, {
      description: 'Description 2',
      name: 'Category 2',
      type: 'Type 2',
    });
  });

  it('should be able to import some categories when registered categories already exist', async () => {
    (spiedFindByName as jest.Mock).mockResolvedValueOnce({
      description: 'Description 1',
      name: 'Category 1',
      type: 'Type 1',
      createdAt: new Date(2024, 1, 1),
      id: 'faked-id',
    });

    const file = { path: 'fake/path.csv' } as Express.Multer.File;

    await importCategoriesUseCase.execute(file);

    expect(spiedParserCSV).toHaveBeenCalledWith(file.path, [
      'name',
      'description',
      'type',
    ]);
    expect(spiedFindByName).toHaveBeenNthCalledWith(2, 'Category 2');
    expect(spiedCreate).toHaveBeenNthCalledWith(1, {
      description: 'Description 2',
      name: 'Category 2',
      type: 'Type 2',
    });
  });
});
