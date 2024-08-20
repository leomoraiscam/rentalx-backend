import { InMemoryCSVStreamParserProvider } from '@shared/container/providers/CSVStreamParserProvider/in-memory/InMemoryCSVStreamParserProvider';

import { InMemorySpecificationRepository } from '../../repositories/in-memory/InMemorySpecificationRepository';
import { ImportSpecificationsUseCase } from './ImportSpecificationsUseCase';

describe('ImportSpecificationsUseCase', () => {
  let inMemorySpecificationRepository: InMemorySpecificationRepository;
  let inMemoryCSVStreamParseProvider: InMemoryCSVStreamParserProvider;
  let importSpecificationsUseCase: ImportSpecificationsUseCase;
  let spiedFindByName: unknown;
  let spiedCreate: unknown;
  let spiedParserCSV: unknown;

  beforeEach(() => {
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryCSVStreamParseProvider = new InMemoryCSVStreamParserProvider();
    importSpecificationsUseCase = new ImportSpecificationsUseCase(
      inMemorySpecificationRepository,
      inMemoryCSVStreamParseProvider
    );
    spiedFindByName = jest.spyOn(inMemorySpecificationRepository, 'findByName');
    spiedCreate = jest.spyOn(inMemorySpecificationRepository, 'create');
    spiedParserCSV = jest.spyOn(inMemoryCSVStreamParseProvider, 'parse');
  });

  it('should be able to import all specifications when a non exist specifications registered', async () => {
    const file = { path: 'fake/path.csv' } as Express.Multer.File;

    await importSpecificationsUseCase.execute(file);

    expect(spiedParserCSV).toHaveBeenCalledWith(file.path, [
      'name',
      'description',
    ]);
    expect(spiedFindByName).toHaveBeenNthCalledWith(2, 'Specification 2');
    expect(spiedCreate).toHaveBeenNthCalledWith(2, {
      description: 'Description 2',
      name: 'Specification 2',
    });
  });

  it('should be able to import some specifications when registered specifications already exist', async () => {
    (spiedFindByName as jest.Mock).mockResolvedValueOnce({
      description: 'Specification 1',
      name: 'Specification 1',
      createdAt: new Date(2024, 1, 1),
      id: 'faked-id',
    });

    const file = { path: 'fake/path.csv' } as Express.Multer.File;

    await importSpecificationsUseCase.execute(file);

    expect(spiedParserCSV).toHaveBeenCalledWith(file.path, [
      'name',
      'description',
    ]);
    expect(spiedFindByName).toHaveBeenNthCalledWith(2, 'Specification 2');
    expect(spiedCreate).toHaveBeenNthCalledWith(1, {
      description: 'Description 2',
      name: 'Specification 2',
    });
  });
});
