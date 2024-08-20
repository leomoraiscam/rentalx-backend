import { InMemoryUserRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserRepository';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { RentalStatus } from '@modules/rentals/dtos/enums/RentatStatus';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

describe('CreateRentalUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let inMemoryCarRepository: InMemoryCarRepository;
  let createRentalUseCase: CreateRentalUseCase;
  let inMemoryDateProvider: InMemoryDateProvider;
  let dayAdd24Hours: Date;

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
    jest.spyOn(inMemoryDateProvider, 'dateNow').mockImplementation(() => {
      return new Date(2024, 3, 8, 8);
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
    const rental = await createRentalUseCase.execute({
      userId: 'fake-user-id',
      carId,
      startDate: new Date(2024, 3, 10, 8),
      expectedReturnDate: dayAdd24Hours,
    });

    expect(rental).toHaveProperty('id');
    expect(rental.status).toBe(RentalStatus.PENDING);
  });

  it('should be able to create a new rental when received start and end date', async () => {
    jest.spyOn(inMemoryDateProvider, 'dateNow').mockImplementation(() => {
      return new Date(2024, 3, 8, 8);
    });

    const { id: carId } = await inMemoryCarRepository.create({
      name: 'R8',
      brand: 'Audi',
      description: 'super sport car',
      dailyRate: 900,
      licensePlate: 'IKV-911',
      fineAmount: 480,
      categoryId: 'sportive',
      specifications: [
        {
          id: 'fake-id',
          createdAt: new Date(),
          description: 'fake-description',
          name: 'fake-name',
        },
      ],
    });
    const rental = await createRentalUseCase.execute({
      userId: 'fake-user-id',
      carId,
      startDate: new Date(2024, 3, 10, 8),
      expectedReturnDate: new Date(2024, 3, 12, 12),
    });

    expect(rental).toHaveProperty('id');
    expect(rental.startDate).toEqual(new Date(2024, 3, 10, 8));
    expect(rental.expectedReturnDate).toEqual(new Date(2024, 3, 12, 12));
    expect(rental.status).toBe(RentalStatus.PENDING);
  });

  it('should not be able to create a new rental with invalid return time when received start and end date', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8).getTime();
    });

    expect(
      createRentalUseCase.execute({
        userId: 'fake-user-id',
        carId: 'fake-car-id',
        startDate: new Date(2024, 3, 10, 12),
        expectedReturnDate: new Date(2024, 3, 10, 14),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open to the same car', async () => {
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

    await inMemoryRentalRepository.create({
      carId,
      startDate: new Date(2024, 3, 10, 12),
      expectedReturnDate: dayAdd24Hours,
      userId: 'fake-user-id',
    });

    await expect(
      createRentalUseCase.execute({
        carId,
        startDate: new Date(2024, 3, 10, 12),
        expectedReturnDate: dayAdd24Hours,
        userId: 'fake-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8).getTime();
    });

    const dayAdd24HoursInMemory = inMemoryDateProvider.addDays(1);
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
    const { id: userId } = await inMemoryUserRepository.create({
      name: 'Teresa Hammond',
      email: 'fal@kecahpos.jm',
      password: 'any-pass123',
      driverLicense: '9118477562',
    });

    await inMemoryRentalRepository.create({
      carId,
      startDate: new Date(2024, 3, 10, 12),
      expectedReturnDate: dayAdd24HoursInMemory,
      userId,
    });

    await expect(
      createRentalUseCase.execute({
        userId,
        carId: 'fake-car-id',
        startDate: new Date(2024, 3, 10, 12),
        expectedReturnDate: dayAdd24HoursInMemory,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open to the same user to distinct cars', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8).getTime();
    });

    const dayAdd24HoursInMemory = inMemoryDateProvider.addDays(1);
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
    const { id: userId } = await inMemoryUserRepository.create({
      name: 'Teresa Hammond',
      email: 'fal@kecahpos.jm',
      password: 'any-pass123',
      driverLicense: '9118477562',
    });

    await inMemoryRentalRepository.create({
      carId,
      startDate: new Date(2024, 3, 10, 12),
      expectedReturnDate: dayAdd24HoursInMemory,
      userId,
    });

    await expect(
      createRentalUseCase.execute({
        userId,
        carId,
        expectedReturnDate: dayAdd24HoursInMemory,
        startDate: new Date(2024, 3, 10, 12),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental with invalid return time', async () => {
    const dateNow = await inMemoryDateProvider.dateNow();
    const dayAdd2Hours = inMemoryDateProvider.addHours(2);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8).getTime();
    });

    expect(
      createRentalUseCase.execute({
        userId: 'fake-user-id',
        carId: 'fake-car-id',
        startDate: dateNow,
        expectedReturnDate: dayAdd2Hours,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental with start date before now', async () => {
    const dayAdd2Hours = inMemoryDateProvider.addDays(2);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8).getTime();
    });

    expect(
      createRentalUseCase.execute({
        userId: 'fake-user-id',
        carId: 'fake-car-id',
        startDate: new Date(2024, 3, 10),
        expectedReturnDate: dayAdd2Hours,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when the same is closed', async () => {
    const dayAdd2Hours = inMemoryDateProvider.addDays(2);

    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8, 10).getTime();
    });

    expect(
      createRentalUseCase.execute({
        userId: 'fake-user-id',
        carId: 'fake-car-id',
        startDate: new Date(2024, 3, 10, 6),
        expectedReturnDate: dayAdd2Hours,
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when the same is closed', async () => {
    jest.spyOn(Date, 'now').mockImplementation(() => {
      return new Date(2024, 3, 8, 10).getTime();
    });

    expect(
      createRentalUseCase.execute({
        userId: 'fake-user-id',
        carId: 'fake-car-id',
        startDate: new Date(2024, 3, 10, 6),
        expectedReturnDate: new Date(2024, 3, 12, 7),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when the car a non exist', async () => {
    expect(
      createRentalUseCase.execute({
        userId: 'fake-user-id',
        carId: 'fake-car-id',
        startDate: new Date(2024, 3, 10, 6),
        expectedReturnDate: new Date(2024, 3, 12, 7),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
