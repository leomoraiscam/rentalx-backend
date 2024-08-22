import { OrdenationProps } from '@modules/cars/dtos/IQueryListOptionsDTO';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';

import { ListSpecificationsUseCase } from './ListSpecificationsUseCase';

describe('ListSpecificationsUseCase', () => {
  let inMemorySpecificationRepository: InMemorySpecificationRepository;
  let listSpecificationsUseCase: ListSpecificationsUseCase;

  beforeEach(() => {
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    listSpecificationsUseCase = new ListSpecificationsUseCase(
      inMemorySpecificationRepository
    );
  });

  it('should be able to return all specifications when specifications list with success', async () => {
    await Promise.all([
      inMemorySpecificationRepository.create({
        name: '2.0',
        description: 'Potência de motor',
      }),
      inMemorySpecificationRepository.create({
        name: '4 Portas',
        description: 'Quantidade de portas',
      }),
      inMemorySpecificationRepository.create({
        name: 'ABS',
        description: 'Freio ABS',
      }),
    ]);

    const { data: specifications } = await listSpecificationsUseCase.execute({
      page: 1,
      perPage: 10,
      order: OrdenationProps.ASC,
    });

    expect(specifications).toHaveLength(3);
    expect(specifications).toEqual(
      expect.arrayContaining([
        expect.objectContaining({ name: '2.0' }),
        expect.objectContaining({ name: '4 Portas' }),
        expect.objectContaining({ name: 'ABS' }),
      ])
    );
  });

  it('should be able to return categories in ascending order by default', async () => {
    await Promise.all([
      inMemorySpecificationRepository.create({
        name: '2.0',
        description: 'Potência de motor',
      }),
      inMemorySpecificationRepository.create({
        name: '1.0',
        description: 'Potência de motor',
      }),
      inMemorySpecificationRepository.create({
        name: '1.4',
        description: 'Potência de motor',
      }),
    ]);

    const { data: specifications } = await listSpecificationsUseCase.execute({
      page: 1,
      perPage: 10,
      order: OrdenationProps.ASC,
    });

    expect(specifications[0].name).toBe('1.0');
    expect(specifications[1].name).toBe('1.4');
    expect(specifications[2].name).toBe('2.0');
  });

  it('should be able to return an empty array if no specifications exist', async () => {
    const { data: specifications } = await listSpecificationsUseCase.execute({
      page: 1,
      perPage: 10,
      order: OrdenationProps.ASC,
    });

    expect(specifications).toEqual([]);
  });
});
