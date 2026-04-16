import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { RentalStatus } from '@modules/rentals/enums/rentalStatus';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { AppError } from '@shared/errors/AppError';

import { InMemoryRentalRepository } from '../../repositories/in-memory/InMemoryRentalRepository';
import { DevolutionRentalUseCase } from './DevolutionRentalUseCase';

describe('DevolutionRentalUseCase', () => {
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryDateProvider: InMemoryDateProvider;
  let devolutionRentalUseCase: DevolutionRentalUseCase;
  let carId: string;

  beforeEach(async () => {
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    devolutionRentalUseCase = new DevolutionRentalUseCase(
      inMemoryRentalRepository,
      inMemoryCarRepository,
      inMemoryDateProvider
    );
    const { id } = await inMemoryCarRepository.create({
      name: 'A3',
      brand: 'Audi',
      description: 'Car test',
      dailyRate: 100,
      licensePlate: 'AJN-730',
      fineAmount: 80,
      categoryId: 'executive',
      category: ({
        name: 'executive',
      } as unknown) as Category,
      specifications: [
        {
          id: 'fake-id',
          createdAt: new Date(),
          description: 'fake-description',
          name: 'fake-name',
        },
      ],
    });
    carId = id;
  });

  it('should be able to return an devolution rental when received correct data', async () => {
    jest.spyOn(inMemoryDateProvider, 'dateNow').mockImplementationOnce(() => {
      return new Date(2024, 3, 8);
    });

    const { id } = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId,
      status: RentalStatus.PickedUp,
      expectedReturnDate: new Date(2024, 3, 11, 12),
      startDate: new Date(2024, 3, 10, 12),
    });
    const rental = await devolutionRentalUseCase.execute(id);

    expect(rental.period).toHaveProperty('endDate');
    expect(rental.period.endDate).toEqual(new Date(2024, 3, 8));
  });

  it('should be able to return an devolution rental with total property when ocurred in less 24 hours', async () => {
    jest.spyOn(inMemoryDateProvider, 'dateNow').mockImplementationOnce(() => {
      return new Date(2024, 3, 3, 9);
    });

    const { id } = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId,
      startDate: new Date(2024, 3, 3, 10),
      expectedReturnDate: new Date(2024, 3, 3, 12),
      status: RentalStatus.PickedUp,
    });
    const devolutionRental = await devolutionRentalUseCase.execute(id);

    expect(devolutionRental.finance.total).toEqual(100);
  });

  it('should be able to return an devolution rental when ocurred 1 days after', async () => {
    jest.spyOn(inMemoryDateProvider, 'dateNow').mockImplementationOnce(() => {
      return new Date(2024, 3, 3, 9);
    });

    const { id } = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId,
      expectedReturnDate: new Date(2024, 3, 4, 11),
      startDate: new Date(2024, 3, 3, 11),
      status: RentalStatus.PickedUp,
    });
    const devolutionRental = await devolutionRentalUseCase.execute(id);

    expect(devolutionRental.finance.total).toEqual(180);
  });

  it('should not be able to return an devolution rental when the same a non-exist', async () => {
    const id = 'a-non-exist-rental';

    await expect(devolutionRentalUseCase.execute(id)).rejects.toBeInstanceOf(
      AppError
    );
  });

  it('should not be able to return an devolution rental when status is different of picked up', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8).getTime();
    });

    const { id } = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId,
      expectedReturnDate: new Date(2024, 3, 11, 12),
      startDate: new Date(2024, 3, 10, 12),
      status: RentalStatus.Confirmed,
    });
    await expect(devolutionRentalUseCase.execute(id)).rejects.toBeInstanceOf(
      AppError
    );
  });

  it('should not be able to return an devolution rental when status is different of overdue', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8).getTime();
    });

    const { id } = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId,
      expectedReturnDate: new Date(2024, 3, 11, 12),
      startDate: new Date(2024, 3, 10, 12),
      status: RentalStatus.Closed,
    });
    await expect(devolutionRentalUseCase.execute(id)).rejects.toBeInstanceOf(
      AppError
    );
  });

  it('should not be able to return an devolution rental when car a non-exist', async () => {
    const { id } = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId: 'faked-car',
      expectedReturnDate: new Date(2024, 3, 11, 12),
      startDate: new Date(2024, 3, 10, 12),
      status: RentalStatus.PickedUp,
    });

    await expect(devolutionRentalUseCase.execute(id)).rejects.toBeInstanceOf(
      AppError
    );
  });
});
