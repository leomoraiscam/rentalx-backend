import dayjs from 'dayjs';

import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { AppError } from '@shared/errors/AppError';

import { InMemoryRentalRepository } from '../../repositories/in-memory/InMemoryRentalRepository';
import { DevolutionRentalUseCase } from './DevolutionRentalUseCase';

describe('DevolutionRentalUseCase', () => {
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryDateProvider: InMemoryDateProvider;
  let devolutionRentalUseCase: DevolutionRentalUseCase;

  const dayAdd24Hours = dayjs().add(1, 'day').toDate();

  beforeEach(() => {
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    devolutionRentalUseCase = new DevolutionRentalUseCase(
      inMemoryRentalRepository,
      inMemoryCarRepository,
      inMemoryDateProvider
    );
  });

  it('should be able to devolve a rental', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8).getTime();
    });

    const { id: carId } = await inMemoryCarRepository.create({
      name: 'A3',
      brand: 'Audi',
      description: 'Car test',
      dailyRate: 100,
      licensePlate: 'AJN-730',
      fineAmount: 80,
      categoryId: 'executive',
      specifications: [
        {
          id: 'fake-id',
          createdAt: new Date(),
          description: 'fake-description',
          name: 'fake-name',
        },
      ],
    });

    const rental = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId,
      status: 'confirmed',
      expectedReturnDate: dayAdd24Hours,
      startDate: new Date(2024, 3, 10, 12),
    });

    const updatedRental = await devolutionRentalUseCase.execute({
      id: rental.id,
    });

    expect(updatedRental).toHaveProperty('endDate');
  });

  it('should not be able to devolve a rental when the same a non exist', async () => {
    await expect(
      devolutionRentalUseCase.execute({ id: 'a-non-exist-rental' })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to devolve a rental when the same a non exist', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8).getTime();
    });

    const rental = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId: 'fake-car-id',
      expectedReturnDate: dayAdd24Hours,
      startDate: new Date(2024, 3, 10, 12),
    });

    await expect(
      devolutionRentalUseCase.execute({ id: rental.id })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to set devolution rental to the same day when ocurred in less 24 hours', async () => {
    const dateNow = inMemoryDateProvider.dateNow();
    const dayAdd2Hours = inMemoryDateProvider.addHours(2);

    const { id: carId } = await inMemoryCarRepository.create({
      name: 'A3',
      brand: 'Audi',
      description: 'Car test',
      dailyRate: 100,
      licensePlate: 'AJN-730',
      fineAmount: 80,
      categoryId: 'executive',
      specifications: [
        {
          id: 'fake-id',
          createdAt: new Date(),
          description: 'fake-description',
          name: 'fake-name',
        },
      ],
    });

    const rental = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId,
      startDate: dateNow,
      expectedReturnDate: dayAdd2Hours,
      status: 'confirmed',
    });

    const devolutionRental = await devolutionRentalUseCase.execute({
      id: rental.id,
    });

    expect(devolutionRental.total).toEqual(100);
  });

  it('should be able to set devolution rental to 1 days after', async () => {
    const dayAdd2Hours = inMemoryDateProvider.addHours(2);

    const { id: carId } = await inMemoryCarRepository.create({
      name: 'A3',
      brand: 'Audi',
      description: 'Car test',
      dailyRate: 100,
      licensePlate: 'AJN-730',
      fineAmount: 80,
      categoryId: 'executive',
      specifications: [
        {
          id: 'fake-id',
          createdAt: new Date(),
          description: 'fake-description',
          name: 'fake-name',
        },
      ],
    });

    const rental = await inMemoryRentalRepository.create({
      userId: 'fake-user-id',
      carId,
      expectedReturnDate: dayAdd24Hours,
      startDate: dayAdd2Hours,
      status: 'confirmed',
    });

    const devolutionRental = await devolutionRentalUseCase.execute({
      id: rental.id,
    });

    expect(devolutionRental.total).toEqual(180);
  });
});
