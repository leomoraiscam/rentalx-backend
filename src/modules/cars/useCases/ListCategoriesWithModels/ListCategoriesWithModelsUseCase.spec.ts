import { CategoryType } from '@modules/cars/enums/CategoryType';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { InMemoryLoggerProvider } from '@shared/container/providers/LoggerProvider/in-memory/InMemoryLoggerProvider';

import { ListCategoriesWithModelsUseCase } from './ListCategoriesWithModelsUseCase';

describe('ListCategoriesWithModelsUseCase', () => {
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let inMemorySpecificationRepository: InMemorySpecificationRepository;
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let inMemoryLoggerProvider: InMemoryLoggerProvider;
  let listCategoriesWithModelsUseCase: ListCategoriesWithModelsUseCase;
  let category: Category;
  let suvCategory: Category;
  let specification: Specification;

  beforeEach(async () => {
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryLoggerProvider = new InMemoryLoggerProvider();
    listCategoriesWithModelsUseCase = new ListCategoriesWithModelsUseCase(
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

  it('should be able to return all cars classified by categories with available true when least one car available', async () => {
    const [firstCar, secondCar] = await Promise.all([
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
            id: 'fake-image-id',
            imageName: 'mustang-image',
            createdAt: new Date(2024, 2, 10),
          },
        ],
      }),
      inMemoryCarRepository.create({
        name: 'M2',
        brand: 'BMW',
        description: 'BMW M2',
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
      }),
    ]);

    await inMemoryRentalRepository.create({
      carId: secondCar.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
    });

    const cars = await listCategoriesWithModelsUseCase.execute({
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
    });

    expect(cars).toEqual([
      {
        id: category.id,
        name: category.name,
        type: category.type,
        models: [
          {
            name: firstCar.name,
            brand: firstCar.brand,
            description: firstCar.description,
            dailyRate: firstCar.dailyRate,
            fineAmount: firstCar.fineAmount,
            specifications: firstCar.specifications,
            images: firstCar.images,
            total: 1,
            totalAvailable: 1,
          },
          {
            name: secondCar.name,
            brand: secondCar.brand,
            description: secondCar.description,
            dailyRate: secondCar.dailyRate,
            fineAmount: secondCar.fineAmount,
            specifications: secondCar.specifications,
            images: secondCar.images,
            total: 1,
            totalAvailable: 0,
          },
        ],
        available: true,
      },
    ]);
  });

  it('should be able to return all cars classified by categories with available false when a non exits available car', async () => {
    const [firstCar, secondCar] = await Promise.all([
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
            id: 'fake-image-id',
            imageName: 'mustang-image',
            createdAt: new Date(2024, 2, 10),
          },
        ],
      }),
      inMemoryCarRepository.create({
        name: 'M2',
        brand: 'BMW',
        description: 'BMW M2',
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
      }),
    ]);

    await Promise.all([
      inMemoryRentalRepository.create({
        carId: firstCar.id,
        startDate: new Date(2024, 2, 19),
        expectedReturnDate: new Date(2024, 2, 22),
        userId: 'fake-user-id',
      }),
      inMemoryRentalRepository.create({
        carId: secondCar.id,
        startDate: new Date(2024, 2, 20),
        expectedReturnDate: new Date(2024, 2, 23),
        userId: 'fake-user-id',
      }),
    ]);

    const cars = await listCategoriesWithModelsUseCase.execute({
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
    });

    expect(cars).toEqual([
      {
        id: category.id,
        name: category.name,
        type: category.type,
        models: [
          {
            name: firstCar.name,
            brand: firstCar.brand,
            description: firstCar.description,
            dailyRate: firstCar.dailyRate,
            fineAmount: firstCar.fineAmount,
            specifications: firstCar.specifications,
            images: firstCar.images,
            total: 1,
            totalAvailable: 0,
          },
          {
            name: secondCar.name,
            brand: secondCar.brand,
            description: secondCar.description,
            dailyRate: secondCar.dailyRate,
            fineAmount: secondCar.fineAmount,
            specifications: secondCar.specifications,
            images: secondCar.images,
            total: 1,
            totalAvailable: 0,
          },
        ],
        available: false,
      },
    ]);
    expect(cars).toHaveLength(1);
  });

  it('should be able to return cars classified by categories and brand when received filter by vehicle brand', async () => {
    const [firstCar] = await Promise.all([
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
            id: 'fake-image-id',
            imageName: 'mustang-image',
            createdAt: new Date(2024, 2, 26),
          },
        ],
      }),
      inMemoryCarRepository.create({
        name: 'X6',
        brand: 'BMW',
        description: 'BMW X6',
        dailyRate: 800,
        licensePlate: 'LKO-001',
        fineAmount: 800,
        categoryId: suvCategory.id,
        category: suvCategory,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'bmw-x6-image',
            createdAt: new Date(2024, 2, 26),
          },
        ],
      }),
    ]);
    const cars = await listCategoriesWithModelsUseCase.execute({
      brand: 'Ford',
    });

    expect(cars).toEqual([
      {
        id: category.id,
        name: category.name,
        type: category.type,
        models: [
          {
            name: firstCar.name,
            brand: firstCar.brand,
            description: firstCar.description,
            dailyRate: firstCar.dailyRate,
            fineAmount: firstCar.fineAmount,
            specifications: firstCar.specifications,
            images: firstCar.images,
            total: 1,
            totalAvailable: 1,
          },
        ],
        available: true,
      },
    ]);
    expect(cars[0].available).toBeTruthy();
    expect(cars).toHaveLength(1);
    expect(cars[0].models).toHaveLength(1);
  });

  it('should be able to return cars classified by categories and type when received filter by vehicle type', async () => {
    const [firstCar] = await Promise.all([
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
            id: 'fake-image-id',
            imageName: 'mustang-image',
            createdAt: new Date(2024, 2, 26),
          },
        ],
      }),
      inMemoryCarRepository.create({
        name: 'X6',
        brand: 'BMW',
        description: 'BMW X6',
        dailyRate: 800,
        licensePlate: 'LKO-001',
        fineAmount: 800,
        categoryId: suvCategory.id,
        category: suvCategory,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'bmw-x6-image',
            createdAt: new Date(2024, 2, 26),
          },
        ],
      }),
    ]);

    const cars = await listCategoriesWithModelsUseCase.execute({
      type: CategoryType.SPORT,
    });

    expect(cars).toEqual([
      {
        id: category.id,
        name: category.name,
        type: category.type,
        models: [
          {
            name: firstCar.name,
            brand: firstCar.brand,
            description: firstCar.description,
            dailyRate: firstCar.dailyRate,
            fineAmount: firstCar.fineAmount,
            specifications: firstCar.specifications,
            images: firstCar.images,
            total: 1,
            totalAvailable: 1,
          },
        ],
        available: true,
      },
    ]);
    expect(cars[0].available).toBeTruthy();
    expect(cars).toHaveLength(1);
    expect(cars[0].models).toHaveLength(1);
  });

  it('should be able to return cars classified by categories, brand and type when received filter by vehicle brand and type', async () => {
    const [_, secondCar, thirdCar] = await Promise.all([
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
            id: 'fake-image-id',
            imageName: 'mustang-image',
            createdAt: new Date(2024, 2, 26),
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
      inMemoryCarRepository.create({
        name: 'M8',
        brand: 'BMW',
        description: 'BMW M8',
        dailyRate: 1000,
        licensePlate: 'DJA-004',
        fineAmount: 1000,
        categoryId: category.id,
        category,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'bmw-m8-image',
            createdAt: new Date(2024, 2, 26),
          },
        ],
      }),
      inMemoryCarRepository.create({
        name: 'X6',
        brand: 'BMW',
        description: 'BMW X6',
        dailyRate: 800,
        licensePlate: 'LKO-001',
        fineAmount: 800,
        categoryId: suvCategory.id,
        category: suvCategory,
        specifications: [specification],
        images: [
          {
            id: 'fake-image-id',
            imageName: 'bmw-x6-image',
            createdAt: new Date(2024, 2, 26),
          },
        ],
      }),
    ]);

    const cars = await listCategoriesWithModelsUseCase.execute({
      type: CategoryType.SPORT,
      brand: 'BMW',
    });

    expect(cars).toEqual([
      {
        id: category.id,
        name: category.name,
        type: category.type,
        models: [
          {
            name: secondCar.name,
            brand: secondCar.brand,
            description: secondCar.description,
            dailyRate: secondCar.dailyRate,
            fineAmount: secondCar.fineAmount,
            specifications: secondCar.specifications,
            images: secondCar.images,
            total: 1,
            totalAvailable: 1,
          },
          {
            name: thirdCar.name,
            brand: thirdCar.brand,
            description: thirdCar.description,
            dailyRate: thirdCar.dailyRate,
            fineAmount: thirdCar.fineAmount,
            specifications: thirdCar.specifications,
            images: thirdCar.images,
            total: 1,
            totalAvailable: 1,
          },
        ],
        available: true,
      },
    ]);
    expect(cars[0].available).toBeTruthy();
    expect(cars).toHaveLength(1);
    expect(cars[0].models).toHaveLength(2);
  });
});
