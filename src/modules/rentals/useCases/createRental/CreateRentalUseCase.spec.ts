import dayjs from 'dayjs';

import { InMemoryUserRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserRepository';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryRentalRepository: InMemoryRentalRepository;
let inMemoryCarRepository: InMemoryCarRepository;
let createRentalUseCase: CreateRentalUseCase;
let inMemoryDateProvider: InMemoryDateProvider;
let dayAdd24Hours: Date;

describe('CreateRentalUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    createRentalUseCase = new CreateRentalUseCase(
      inMemoryRentalRepository,
      inMemoryDateProvider,
      inMemoryCarRepository
    );

    dayAdd24Hours = inMemoryDateProvider.addDays(1);
  });

  it('should be able to create a new rental', async () => {
    const { id: carId } = await inMemoryCarRepository.create({
      name: 'A3',
      brand: 'Audi',
      description: 'Car test',
      dailyRate: 100,
      licensePlate: 'AJN-730',
      fineAmount: 80,
      categoryId: 'executive',
    });

    const rental = await createRentalUseCase.execute({
      userId: 'fake-user-id',
      carId,
      expectedReturnDate: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental).toHaveProperty('startDate');
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
    const { id: carId } = await inMemoryCarRepository.create({
      name: 'A3',
      brand: 'Audi',
      description: 'Car test',
      dailyRate: 100,
      licensePlate: 'AJN-730',
      fineAmount: 80,
      categoryId: 'executive',
    });

    await inMemoryRentalRepository.create({
      carId,
      expectedReturnDate: dayAdd24Hours,
      userId: 'fake-user-id',
    });

    await expect(
      createRentalUseCase.execute({
        carId,
        expectedReturnDate: dayAdd24Hours,
        userId: 'fake-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    const dayAdd24HoursInMemory = inMemoryDateProvider.addDays(1);

    const { id: carId } = await inMemoryCarRepository.create({
      name: 'A3',
      brand: 'Audi',
      description: 'Car test',
      dailyRate: 100,
      licensePlate: 'AJN-730',
      fineAmount: 80,
      categoryId: 'executive',
    });

    const { id: userId } = await inMemoryUserRepository.create({
      name: 'Teresa Hammond',
      email: 'fal@kecahpos.jm',
      password: 'any-pass123',
      driverLicense: '9118477562',
    });

    await inMemoryRentalRepository.create({
      carId,
      expectedReturnDate: dayAdd24HoursInMemory,
      userId,
    });

    await expect(
      createRentalUseCase.execute({
        userId,
        carId: 'fake-car-id',
        expectedReturnDate: dayAdd24HoursInMemory,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open to the same user to distinct cars', async () => {
    const dayAdd24HoursInMemory = inMemoryDateProvider.addDays(1);

    const { id: carId } = await inMemoryCarRepository.create({
      name: 'A3',
      brand: 'Audi',
      description: 'Car test',
      dailyRate: 100,
      licensePlate: 'AJN-730',
      fineAmount: 80,
      categoryId: 'executive',
    });

    const { id: userId } = await inMemoryUserRepository.create({
      name: 'Teresa Hammond',
      email: 'fal@kecahpos.jm',
      password: 'any-pass123',
      driverLicense: '9118477562',
    });

    await inMemoryRentalRepository.create({
      carId,
      expectedReturnDate: dayAdd24HoursInMemory,
      userId,
    });

    await expect(
      createRentalUseCase.execute({
        userId,
        carId,
        expectedReturnDate: dayAdd24HoursInMemory,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    expect(
      createRentalUseCase.execute({
        userId: 'fake-user-id',
        carId: 'fake-car-id',
        expectedReturnDate: dayjs().toDate(),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
