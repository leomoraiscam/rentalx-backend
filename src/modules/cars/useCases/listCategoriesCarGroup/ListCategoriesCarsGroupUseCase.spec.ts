import { CategoryType } from '@modules/cars/dtos/ICreateCategoryDTO';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';

import { ListCategoriesCarsGroupUseCase } from './ListCategoriesCarsGroupUseCase';

let inMemoryCarRepository: InMemoryCarRepository;
let inMemoryCategoryRepository: InMemoryCategoryRepository;
let inMemorySpecificationRepository: InMemorySpecificationRepository;
let inMemoryRentalRepository: InMemoryRentalRepository;
let listCategoriesCarsGroupUseCase: ListCategoriesCarsGroupUseCase;
let category: Category;
let specification: Specification;

describe('ListAvailableCarsUseCase', () => {
  beforeEach(async () => {
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    listCategoriesCarsGroupUseCase = new ListCategoriesCarsGroupUseCase(
      inMemoryCarRepository,
      inMemoryCategoryRepository,
      inMemoryRentalRepository
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
  });

  it('should be able to list all cars (available and unavailable) classified by groups or categories', async () => {
    await inMemoryCarRepository.create({
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
    });

    const cars = await listCategoriesCarsGroupUseCase.execute({});

    expect(cars).toEqual(
      expect.arrayContaining([
        expect.objectContaining({
          name: expect.any(String),
          type: expect.any(String),
          cars: expect.arrayContaining([
            expect.objectContaining({
              id: expect.any(String),
              available: expect.any(Boolean),
              name: expect.any(String),
              description: expect.any(String),
              brand: expect.any(String),
              categoryId: expect.any(String),
              dailyRate: expect.any(Number),
              fineAmount: expect.any(Number),
              licensePlate: expect.any(String),
              specifications: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  name: expect.any(String),
                  description: expect.any(String),
                }),
              ]),
              images: expect.arrayContaining([
                expect.objectContaining({
                  id: expect.any(String),
                  imageName: expect.any(String),
                  createdAt: expect.any(Date),
                }),
              ]),
            }),
          ]),
          available: expect.any(Boolean),
        }),
      ])
    );
  });

  it('should be able to list all cars classified by groups or categories (available and unavailable)', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 2, 27).getTime();
    });

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
            createdAt: new Date(2024, 2, 26),
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
            createdAt: new Date(2024, 2, 26),
          },
        ],
      }),
    ]);

    const cars = await listCategoriesCarsGroupUseCase.execute({});

    expect(cars).toEqual([
      {
        name: 'GROUP L - SPORT',
        type: 'sport',
        cars: [
          {
            id: firstCar.id,
            available: true,
            name: 'Mustang',
            description: 'Ford Mustang',
            brand: 'Ford',
            categoryId: category.id,
            dailyRate: 400,
            fineAmount: 400,
            licensePlate: 'DJA-002',
            category,
            specifications: [
              {
                id: specification.id,
                name: 'Direção Elétrica',
                description:
                  'Conjunto mecânico que permite ao motorista conduzir o seu veículo de maneira leve.',
              },
            ],
            images: [
              {
                id: 'fake-image-id',
                imageName: 'mustang-image',
                createdAt: new Date(2024, 2, 26),
              },
            ],
          },
          {
            id: secondCar.id,
            available: true,
            name: 'M2',
            description: 'BMW M2',
            brand: 'BMW',
            categoryId: category.id,
            dailyRate: 600,
            fineAmount: 600,
            licensePlate: 'LKO-001',
            category,
            specifications: [
              {
                id: specification.id,
                name: 'Direção Elétrica',
                description:
                  'Conjunto mecânico que permite ao motorista conduzir o seu veículo de maneira leve.',
              },
            ],
            images: [
              {
                id: 'fake-image-id',
                imageName: 'bmw-image',
                createdAt: new Date(2024, 2, 26),
              },
            ],
          },
        ],
        available: true,
      },
    ]);
  });

  it('should be able to list cars classified by groups or categories when received filter by vehicle brand', async () => {
    const suvCategory = await inMemoryCategoryRepository.create({
      name: 'GROUP L - SUV',
      description: '',
      type: CategoryType.SUV,
    });

    await Promise.all([
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

    const cars = await listCategoriesCarsGroupUseCase.execute({
      brand: 'Ford',
    });

    expect(cars.length).toBe(1);
  });

  it('should be able to list cars classified by groups or categories when received filter by vehicle type', async () => {
    const suvCategory = await inMemoryCategoryRepository.create({
      name: 'GROUP L - SUV',
      description: '',
      type: CategoryType.SUV,
    });

    await Promise.all([
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

    const cars = await listCategoriesCarsGroupUseCase.execute({
      type: CategoryType.SPORT,
    });

    expect(cars.length).toBe(1);
  });

  it('should be able to list cars classified by groups or categories when received filter by vehicle brand and type', async () => {
    const suvCategory = await inMemoryCategoryRepository.create({
      name: 'GROUP L - SUV',
      description: '',
      type: CategoryType.SUV,
    });

    await Promise.all([
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

    const cars = await listCategoriesCarsGroupUseCase.execute({
      type: CategoryType.SPORT,
      brand: 'BMW',
    });

    expect(cars.length).toBe(1);
  });
});
