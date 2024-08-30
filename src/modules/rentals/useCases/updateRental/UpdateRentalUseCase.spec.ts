import { CategoryType } from '@modules/cars/enums/category';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { InMemoryRentalDateService } from '@modules/rentals/services/in-memory/InMemoryRentalDateService';
import { IRentalDateService } from '@modules/rentals/services/IRentalDateService';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { AppError } from '@shared/errors/AppError';

import { UpdateRentalUseCase } from './UpdateRentalUseCase';

describe('UpdateRentalUseCase', () => {
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let inMemorySpecificationRepository: InMemorySpecificationRepository;
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let inMemoryDateProvider: InMemoryDateProvider;
  let inMemoryRentalDateService: IRentalDateService;
  let updateRentalUseCase: UpdateRentalUseCase;
  let category: Category;
  let specification: Specification;
  let firstCar: Car;
  let secondCar: Car;

  beforeEach(async () => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    inMemoryRentalDateService = new InMemoryRentalDateService();
    updateRentalUseCase = new UpdateRentalUseCase(
      inMemoryRentalRepository,
      inMemoryCarRepository,
      inMemoryDateProvider,
      inMemoryRentalDateService
    );

    category = await inMemoryCategoryRepository.create({
      name: 'GROUP L - SPORT',
      description:
        'Designed to optimize aerodynamics, reach higher speeds and offer high performance.',
      type: CategoryType.SPORT,
    });
    specification = await inMemorySpecificationRepository.create({
      name: 'Direção Elétrica',
      description:
        'Conjunto mecânico que permite ao motorista conduzir o seu veículo de maneira leve.',
    });
    [firstCar, secondCar] = await Promise.all([
      inMemoryCarRepository.create({
        name: 'Mustang',
        brand: 'Ford',
        description: 'Ford Mustang',
        dailyRate: 400,
        licensePlate: 'DJA-002',
        fineAmount: 400,
        categoryId: category.id,
        category,
        specifications: [specification],
        images: [
          {
            id: 'fake-id',
            imageName: 'fake-image',
            createdAt: new Date(),
          },
        ],
      }),
      inMemoryCarRepository.create({
        name: 'M2',
        brand: 'BMW',
        description: 'BMW M2',
        dailyRate: 600,
        licensePlate: 'DJA-003',
        fineAmount: 600,
        categoryId: category.id,
        category,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'bmw-m2-image',
            createdAt: new Date(2024, 2, 26),
          },
        ],
      }),
    ]);
    jest.useFakeTimers().setSystemTime(new Date('2024-03-20 08:00:00'));
  });

  it('should be able to update rental when received correct data', async () => {
    const carId = firstCar.id;
    const { id } = await inMemoryRentalRepository.create({
      carId,
      car: firstCar,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
    });
    const updatedRental = await updateRentalUseCase.execute({
      id,
      carId,
      startDate: new Date(2024, 2, 23, 8),
      expectedReturnDate: new Date(2024, 2, 27, 8),
    });

    expect(updatedRental.startDate).toEqual(new Date(2024, 2, 23, 8));
    expect(updatedRental.expectedReturnDate).toEqual(new Date(2024, 2, 27, 8));
    expect(updatedRental.total).toEqual(1600);
  });

  it('should be able to update rental car when received a new car', async () => {
    jest.spyOn(inMemoryDateProvider, 'dateNow').mockImplementationOnce(() => {
      return new Date(2024, 2, 20);
    });

    const { id } = await inMemoryRentalRepository.create({
      carId: firstCar.id,
      startDate: new Date(2024, 2, 20, 8),
      expectedReturnDate: new Date(2024, 2, 23, 8),
      userId: 'fake-user-id',
      status: 'confirmed',
    });
    const updatedRental = await updateRentalUseCase.execute({
      id,
      carId: secondCar.id,
    });

    expect(updatedRental.total).not.toEqual(1600);
    expect(updatedRental.total).toEqual(1800);
    expect(updatedRental.startDate).toEqual(new Date(2024, 2, 20, 8));
    expect(updatedRental.expectedReturnDate).toEqual(new Date(2024, 2, 23, 8));
  });

  it('should not be able to update rental when the car a non exist', async () => {
    expect(
      updateRentalUseCase.execute({
        userId: 'fake-user-id',
        carId: 'fake-car-id',
        startDate: new Date(2024, 3, 10, 6),
        expectedReturnDate: new Date(2024, 3, 12, 7),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update rental when the same a non exist', async () => {
    expect(
      updateRentalUseCase.execute({
        id: 'a-non-exist',
        userId: 'fake-user-id',
        carId: firstCar.id,
        startDate: new Date(2024, 3, 10, 6),
        expectedReturnDate: new Date(2024, 3, 12, 7),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update a rental when return time is invalid', async () => {
    const { id } = await inMemoryRentalRepository.create({
      carId: firstCar.id,
      car: firstCar,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
    });

    expect(
      updateRentalUseCase.execute({
        id,
        carId: firstCar.id,
        startDate: new Date(2024, 3, 10, 12),
        expectedReturnDate: new Date(2024, 3, 10, 14),
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to update rental when start date is before now', async () => {
    const { id } = await inMemoryRentalRepository.create({
      carId: firstCar.id,
      startDate: new Date(2024, 2, 20, 8),
      expectedReturnDate: new Date(2024, 2, 23, 8),
      userId: 'fake-user-id',
      status: 'confirmed',
    });

    expect(
      updateRentalUseCase.execute({
        id,
        userId: 'fake-user-id',
        carId: firstCar.id,
        startDate: new Date(2024, 2, 21, 8),
        expectedReturnDate: new Date(2024, 2, 23, 8),
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
