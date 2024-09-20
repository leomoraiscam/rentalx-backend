import { CarStatus } from '@modules/cars/enums/CarStatus';
import { CategoryType } from '@modules/cars/enums/CategoryType';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { InMemoryLoggerProvider } from '@shared/container/providers/LoggerProvider/in-memory/InMemoryLoggerProvider';

import { ListCarsGroupedByCategoryUseCase } from './ListCarsGroupedByCategoryUseCase';

describe('ListCarsGroupedByCategoryUseCase', () => {
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let inMemorySpecificationRepository: InMemorySpecificationRepository;
  let inMemoryLoggerProvider: InMemoryLoggerProvider;
  let listCarsGroupedByCategoryUseCase: ListCarsGroupedByCategoryUseCase;
  let category: Category;
  let suvCategory: Category;
  let specification: Specification;

  beforeEach(async () => {
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryLoggerProvider = new InMemoryLoggerProvider();
    listCarsGroupedByCategoryUseCase = new ListCarsGroupedByCategoryUseCase(
      inMemoryCarRepository,
      inMemoryCategoryRepository,
      inMemoryRentalRepository,
      inMemoryLoggerProvider
    );

    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 2, 27).getTime();
    });

    [category, suvCategory, specification] = await Promise.all([
      inMemoryCategoryRepository.create({
        name: 'GROUP L - SPORT',
        description:
          'Designed to optimize aerodynamics, reach higher speeds and offer high performance.',
        type: CategoryType.SPORT,
      }),
      inMemoryCategoryRepository.create({
        name: 'GROUP L - SUV',
        description: '',
        type: CategoryType.SUV,
      }),
      inMemorySpecificationRepository.create({
        name: 'Direção Elétrica',
        description:
          'Conjunto mecânico que permite ao motorista conduzir o seu veículo de maneira leve.',
      }),
    ]);
  });

  it('should be able to return all cars classified by categories', async () => {
    const [firstCar, secondCar] = await Promise.all([
      inMemoryCarRepository.create({
        name: 'M2',
        brand: 'BMW',
        description: 'M SPORT',
        dailyRate: 400,
        licensePlate: 'DJA-002',
        fineAmount: 400,
        categoryId: category.id,
        category,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'mustang-image',
            createdAt: new Date(2024, 2, 10),
          },
        ],
        status: CarStatus.AVAILABLE,
      }),
      inMemoryCarRepository.create({
        name: 'R8',
        brand: 'Audi',
        description: 'R SPORT LINE',
        dailyRate: 600,
        licensePlate: 'LKO-001',
        fineAmount: 600,
        categoryId: category.id,
        category,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'bmw-image',
            createdAt: new Date(2024, 2, 10),
          },
        ],
        status: CarStatus.RENTED,
      }),
    ]);

    const cars = await listCarsGroupedByCategoryUseCase.execute({
      categoryId: category.id,
    });

    expect(cars).toEqual({
      id: category.id,
      name: 'GROUP L - SPORT',
      type: 'sport',
      models: [
        {
          name: 'M2',
          brand: 'BMW',
          dailyRate: 400,
          fineAmount: 400,
          total: 1,
          totalAvailable: 1,
          cars: [
            {
              id: firstCar.id,
              licensePlate: firstCar.licensePlate,
              status: firstCar.status,
              specifications: firstCar.specifications,
              images: firstCar.images,
            },
          ],
        },
        {
          name: 'R8',
          brand: 'Audi',
          dailyRate: 600,
          fineAmount: 600,
          total: 1,
          totalAvailable: 1,
          cars: [
            {
              id: secondCar.id,
              licensePlate: secondCar.licensePlate,
              status: secondCar.status,
              specifications: secondCar.specifications,
              images: secondCar.images,
            },
          ],
        },
      ],
    });
  });

  it('should be able to return all cars classified by categories with total available greater than or equal to one when at least one car is available', async () => {
    const [firstCar, secondCar] = await Promise.all([
      inMemoryCarRepository.create({
        name: 'M2',
        brand: 'BMW',
        description: 'M SPORT',
        dailyRate: 400,
        licensePlate: 'DJA-002',
        fineAmount: 400,
        categoryId: category.id,
        category,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'mustang-image',
            createdAt: new Date(2024, 2, 10),
          },
        ],
        status: CarStatus.AVAILABLE,
      }),
      inMemoryCarRepository.create({
        name: 'R8',
        brand: 'Audi',
        description: 'R SPORT LINE',
        dailyRate: 600,
        licensePlate: 'LKO-001',
        fineAmount: 600,
        categoryId: category.id,
        category,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'bmw-image',
            createdAt: new Date(2024, 2, 10),
          },
        ],
        status: CarStatus.RENTED,
      }),
    ]);

    await inMemoryRentalRepository.create({
      carId: secondCar.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
    });

    const cars = await listCarsGroupedByCategoryUseCase.execute({
      categoryId: category.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
    });

    expect(cars).toEqual({
      id: category.id,
      name: 'GROUP L - SPORT',
      type: 'sport',
      models: [
        {
          name: 'M2',
          brand: 'BMW',
          dailyRate: 400,
          fineAmount: 400,
          total: 1,
          totalAvailable: 1,
          cars: [
            {
              id: firstCar.id,
              licensePlate: firstCar.licensePlate,
              status: firstCar.status,
              specifications: firstCar.specifications,
              images: firstCar.images,
            },
          ],
        },
        {
          name: 'R8',
          brand: 'Audi',
          dailyRate: 600,
          fineAmount: 600,
          total: 1,
          totalAvailable: 0,
          cars: [
            {
              id: secondCar.id,
              licensePlate: secondCar.licensePlate,
              status: secondCar.status,
              specifications: secondCar.specifications,
              images: secondCar.images,
            },
          ],
        },
      ],
    });
  });

  it('should be able to return all cars classified by categories with total available equal to zero when no cars are available', async () => {
    const [firstCar, secondCar] = await Promise.all([
      inMemoryCarRepository.create({
        name: 'M2',
        brand: 'BMW',
        description: 'M SPORT',
        dailyRate: 400,
        licensePlate: 'DJA-002',
        fineAmount: 400,
        categoryId: category.id,
        category,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'mustang-image',
            createdAt: new Date(2024, 2, 10),
          },
        ],
        status: CarStatus.AVAILABLE,
      }),
      inMemoryCarRepository.create({
        name: 'R8',
        brand: 'Audi',
        description: 'R SPORT LINE',
        dailyRate: 600,
        licensePlate: 'LKO-001',
        fineAmount: 600,
        categoryId: category.id,
        category,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'bmw-image',
            createdAt: new Date(2024, 2, 10),
          },
        ],
        status: CarStatus.RENTED,
      }),
    ]);

    await Promise.all([
      inMemoryRentalRepository.create({
        carId: secondCar.id,
        startDate: new Date(2024, 2, 20),
        expectedReturnDate: new Date(2024, 2, 23),
        userId: 'fake-user-id',
      }),
      inMemoryRentalRepository.create({
        carId: firstCar.id,
        startDate: new Date(2024, 2, 20),
        expectedReturnDate: new Date(2024, 2, 23),
        userId: 'fake-user-id',
      }),
    ]);

    const cars = await listCarsGroupedByCategoryUseCase.execute({
      categoryId: category.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
    });

    expect(cars).toEqual({
      id: category.id,
      name: 'GROUP L - SPORT',
      type: 'sport',
      models: [
        {
          name: 'M2',
          brand: 'BMW',
          dailyRate: 400,
          fineAmount: 400,
          total: 1,
          totalAvailable: 0,
          cars: [
            {
              id: firstCar.id,
              licensePlate: firstCar.licensePlate,
              status: firstCar.status,
              specifications: firstCar.specifications,
              images: firstCar.images,
            },
          ],
        },
        {
          name: 'R8',
          brand: 'Audi',
          dailyRate: 600,
          fineAmount: 600,
          total: 1,
          totalAvailable: 0,
          cars: [
            {
              id: secondCar.id,
              licensePlate: secondCar.licensePlate,
              status: secondCar.status,
              specifications: secondCar.specifications,
              images: secondCar.images,
            },
          ],
        },
      ],
    });
  });
});
