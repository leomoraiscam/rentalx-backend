import { InMemoryUserRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserRepository';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { RentalStatus } from '@modules/rentals/enums/RentatStatus';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { InMemoryRentalDateService } from '@modules/rentals/services/in-memory/InMemoryRentalDateService';
import { IRentalDateService } from '@modules/rentals/services/IRentalDateService';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { AppError } from '@shared/errors/AppError';

import { CreateRentalUseCase } from './CreateRentalUseCase';

describe('CreateRentalUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let inMemoryCarRepository: InMemoryCarRepository;
  let createRentalUseCase: CreateRentalUseCase;
  let inMemoryDateProvider: InMemoryDateProvider;
  let inMemoryRentalDateService: IRentalDateService;
  let userId: string;
  let carId: string;

  beforeEach(async () => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    inMemoryRentalDateService = new InMemoryRentalDateService();
    createRentalUseCase = new CreateRentalUseCase(
      inMemoryRentalRepository,
      inMemoryDateProvider,
      inMemoryCarRepository,
      inMemoryRentalDateService
    );

    const [user, car] = await Promise.all([
      inMemoryUserRepository.create({
        name: 'Teresa Hammond',
        email: 'fal@kecahpos.jm',
        password: 'any-pass123',
        driverLicense: '9118477562',
      }),
      inMemoryCarRepository.create({
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
      }),
    ]);

    userId = user.id;
    carId = car.id;
  });

  afterEach(() => {
    jest.clearAllMocks();
  });

  it('should be able to create a new rental when received correct data', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-04-10 08:00:00'));

    const rental = await createRentalUseCase.execute({
      userId,
      carId,
      startDate: new Date(2024, 3, 10, 9),
      expectedReturnDate: new Date(2024, 3, 12, 9),
    });

    expect(rental).toHaveProperty('id');
    expect(rental.status).toBe(RentalStatus.CONFIRMED);
  });

  it('should not be able to create a new rental when the car a non exist', async () => {
    expect(
      createRentalUseCase.execute({
        userId,
        carId: 'fake-car-id',
        startDate: new Date(2024, 3, 10, 6),
        expectedReturnDate: new Date(2024, 3, 12, 7),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when return time is invalid', async () => {
    expect(
      createRentalUseCase.execute({
        userId,
        carId,
        startDate: new Date(2024, 3, 10, 12),
        expectedReturnDate: new Date(2024, 3, 10, 14),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental when start date is before now', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-04-10 12:00:00'));

    expect(
      createRentalUseCase.execute({
        userId,
        carId,
        startDate: new Date(2024, 3, 10, 11),
        expectedReturnDate: new Date(2024, 3, 11, 11),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open to the same user', async () => {
    jest.useFakeTimers().setSystemTime(new Date('2024-04-10 08:00:00'));
    jest
      .spyOn(inMemoryRentalRepository, 'findByCarAndDateRange')
      .mockResolvedValueOnce(undefined);

    await inMemoryRentalRepository.create({
      carId,
      userId,
      startDate: new Date(2024, 3, 10, 12),
      expectedReturnDate: new Date(2024, 3, 11, 12),
    });

    await expect(
      createRentalUseCase.execute({
        userId,
        carId,
        startDate: new Date(2024, 3, 10, 12),
        expectedReturnDate: new Date(2024, 3, 11, 12),
      })
    ).rejects.toBeInstanceOf(AppError);
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
      expectedReturnDate: new Date(2024, 3, 11, 12),
      userId,
    });

    await expect(
      createRentalUseCase.execute({
        carId,
        startDate: new Date(2024, 3, 10, 12),
        expectedReturnDate: new Date(2024, 3, 11, 12),
        userId: 'fake-user-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to create a new rental if there is another open to the same user to distinct cars', async () => {
    await inMemoryRentalRepository.create({
      carId,
      startDate: new Date(2024, 3, 10, 12),
      expectedReturnDate: new Date(2024, 3, 11, 12),
      userId,
    });

    await expect(
      createRentalUseCase.execute({
        userId,
        carId,
        startDate: new Date(2024, 3, 10, 12),
        expectedReturnDate: new Date(2024, 3, 11, 12),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
