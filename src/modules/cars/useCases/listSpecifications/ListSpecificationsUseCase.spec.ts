import { OrdenationProps } from '@modules/cars/dtos/IQueryListCategoriesDTO';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';

import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';

let inMemorySpecificationRepository: InMemorySpecificationRepository;
let listSpecificationsUseCase: ListSpecificationsUseCase;

describe('ListSpecificationsUseCase', () => {
  beforeEach(() => {
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    listSpecificationsUseCase = new ListSpecificationsUseCase(
      inMemorySpecificationRepository
    );
  });

  it('should be able to return all specifications', async () => {
    await inMemorySpecificationRepository.create({
      name: '2.0',
      description: 'Potência de motor',
    });
    await inMemorySpecificationRepository.create({
      name: '4 Portas',
      description: 'Quantidade de portas',
    });
    await inMemorySpecificationRepository.create({
      name: 'ABS',
      description: 'Freio ABS',
    });

    const specifications = await listSpecificationsUseCase.execute({
      page: 1,
      perPage: 10,
      order: OrdenationProps.ASC,
    });

    expect(specifications.data.length).toEqual(3);
  });
});
