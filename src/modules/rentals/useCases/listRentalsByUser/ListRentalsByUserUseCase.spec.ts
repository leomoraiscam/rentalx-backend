import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';

import { ListRentalsByUserUseCase } from './ListRentalsByUserUseCase';

let inMemoryRentalRepository: InMemoryRentalRepository;
let listRentalsByUserUseCase: ListRentalsByUserUseCase;

describe('ListRentalsByUserUseCase', () => {
  beforeEach(() => {
    inMemoryRentalRepository = new InMemoryRentalRepository();
    listRentalsByUserUseCase = new ListRentalsByUserUseCase(
      inMemoryRentalRepository
    );
  });

  it('should be able to all rentals by user', async () => {
    await inMemoryRentalRepository.create({
      carId: 'fake-car-id',
      expectedReturnDate: new Date(),
      userId: 'fake-user-id',
    });

    const rentals = await listRentalsByUserUseCase.execute('fake-user-id');

    expect(rentals.length).toEqual(1);
  });

  it('should be able return empty list when user does not have rental', async () => {
    const rentals = await listRentalsByUserUseCase.execute('fake-user-id');

    expect(rentals.length).toEqual(0);
  });
});
