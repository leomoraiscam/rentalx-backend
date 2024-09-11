import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';

import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase';

describe('ListRentalsByUserUseCase', () => {
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let listRentalsByUserUseCase: ListRentalsByUserUseCase;

  beforeEach(() => {
    inMemoryRentalRepository = new InMemoryRentalRepository();
    listRentalsByUserUseCase = new ListRentalsByUserUseCase(
      inMemoryRentalRepository
    );
  });

  it('should be able to return an rental list by user', async () => {
    await inMemoryRentalRepository.create({
      carId: 'fake-car-id',
      expectedReturnDate: new Date(),
      userId: 'fake-user-id',
      startDate: new Date(2024, 3, 10, 12),
    });

    const rentals = await listRentalsByUserUseCase.execute('fake-user-id');

    expect(rentals.length).toEqual(1);
  });

  it('should be able to return an empty list when user does not have rental', async () => {
    const rentals = await listRentalsByUserUseCase.execute('fake-user-id');

    expect(rentals.length).toEqual(0);
  });
});
