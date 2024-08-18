import { InMemoryCSVStreamParserProvider } from '@shared/container/providers/CSVStreamParserProvider/in-memory/InMemoryCSVStreamParserProvider';

import { InMemorySpecificationRepository } from '../../repositories/in-memory/InMemorySpecificationRepository';
import { ImportSpecificationsUseCase } from './ImportSpecificationsUseCase';

describe('ImportSpecificationsUseCase', () => {
  let inMemorySpecificationRepository: InMemorySpecificationRepository;
  let inMemoryCSVStreamParseProvider: InMemoryCSVStreamParserProvider;
  let importSpecificationsUseCase: ImportSpecificationsUseCase;

  beforeEach(() => {
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryCSVStreamParseProvider = new InMemoryCSVStreamParserProvider();
    importSpecificationsUseCase = new ImportSpecificationsUseCase(
      inMemorySpecificationRepository,
      inMemoryCSVStreamParseProvider
    );
  });

  it('should be able to import all specifications when a non exist specifications registered', async () => {
    const spiedFindByNameOfSpecificationRepository = jest.spyOn(
      inMemorySpecificationRepository,
      'findByName'
    );
    const spiedCreateOfSpecificationRepository = jest.spyOn(
      inMemorySpecificationRepository,
      'create'
    );
    const spiedInMemoryCSVStreamParseProvider = jest.spyOn(
      inMemoryCSVStreamParseProvider,
      'parse'
    );
    const file = { path: 'fake/path.csv' } as Express.Multer.File;

    await importSpecificationsUseCase.execute(file);

    expect(spiedInMemoryCSVStreamParseProvider).toHaveBeenCalledWith(
      file.path,
      ['name', 'description']
    );
    expect(spiedFindByNameOfSpecificationRepository).toHaveBeenNthCalledWith(
      2,
      'Specification 2'
    );
    expect(spiedCreateOfSpecificationRepository).toHaveBeenNthCalledWith(2, {
      description: 'Description 2',
      name: 'Specification 2',
    });
  });

  it('should be able to import some specifications when registered specifications already exist', async () => {
    const spiedFindByNameOfSpecificationRepository = jest.spyOn(
      inMemorySpecificationRepository,
      'findByName'
    );
    spiedFindByNameOfSpecificationRepository.mockResolvedValueOnce({
      description: 'Specification 1',
      name: 'Specification 1',
      createdAt: new Date(2024, 1, 1),
      id: 'faked-id',
    });
    const spiedCreateOfSpecificationRepository = jest.spyOn(
      inMemorySpecificationRepository,
      'create'
    );
    const spiedInMemoryCSVStreamParseProvider = jest.spyOn(
      inMemoryCSVStreamParseProvider,
      'parse'
    );
    const file = { path: 'fake/path.csv' } as Express.Multer.File;

    await importSpecificationsUseCase.execute(file);

    expect(spiedInMemoryCSVStreamParseProvider).toHaveBeenCalledWith(
      file.path,
      ['name', 'description']
    );
    expect(spiedFindByNameOfSpecificationRepository).toHaveBeenNthCalledWith(
      2,
      'Specification 2'
    );
    expect(spiedCreateOfSpecificationRepository).toHaveBeenNthCalledWith(1, {
      description: 'Description 2',
      name: 'Specification 2',
    });
  });
});
