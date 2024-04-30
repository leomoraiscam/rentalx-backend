import { CategoryType } from '@modules/cars/dtos/ICreateCategoryDTO';
import { InMemoryCarImageRepository } from '@modules/cars/repositories/in-memory/InMemoryCarImageRepository';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';

import { ListCategoriesCarsGroupUseCase } from './ListCategoriesCarsGroupUseCase';

let inMemoryCarRepository: InMemoryCarRepository;
let inMemoryCategoryRepository: InMemoryCategoryRepository;
let inMemoryImageCarRepository: InMemoryCarImageRepository;
let inMemorySpecificationRepository: InMemorySpecificationRepository;
let inMemoryRentalRepository: InMemoryRentalRepository;
let listCategoriesCarsGroupUseCase: ListCategoriesCarsGroupUseCase;

describe('ListAvailableCarsUseCase', () => {
  beforeEach(() => {
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemoryImageCarRepository = new InMemoryCarImageRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    listCategoriesCarsGroupUseCase = new ListCategoriesCarsGroupUseCase(
      inMemoryCarRepository,
      inMemoryCategoryRepository,
      inMemoryRentalRepository
    );
  });

  it('should be able to list all cars (available and unavailable) classified by groups or categories', async () => {
    const { id: categoryId } = await inMemoryCategoryRepository.create({
      name: 'GROUP L - SPORT',
      description:
        'Designed to optimize aerodynamics, reach higher speeds and offer high performance.',
      type: CategoryType.SPORT,
    });

    const specification = await inMemorySpecificationRepository.create({
      name: 'Direção Elétrica',
      description:
        'Conjunto mecânico que permite ao motorista conduzir o seu veículo de maneira leve.',
    });

    const car = await inMemoryCarRepository.create({
      name: 'Mustang',
      brand: 'Ford',
      description: 'Ford Mustang',
      dailyRate: 400,
      licensePlate: 'DJA-002',
      fineAmount: 400,
      categoryId,
      specifications: [specification],
    });

    const { id: carId } = car;

    const carImage = await inMemoryImageCarRepository.create({
      carId,
      imageName: 'image1.png',
    });

    Object.assign(car, {
      images: [carImage],
    });

    await inMemoryCarRepository.save(car);

    const cars = await listCategoriesCarsGroupUseCase.execute();

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
                  carId: expect.any(String),
                  imageName: expect.any(String),
                }),
              ]),
            }),
          ]),
          available: expect.any(Boolean),
        }),
      ])
    );
  });

  it.todo(
    'should be able to list all cars classified by groups or categories (available and unavailable)'
  );

  it.todo(
    'should be able to list cars classified by groups or categories when received filter by vehicle type'
  );

  it.todo(
    'should be able to list cars classified by groups or categories when received filter by vehicle brand'
  );

  it.todo(
    'should be able to list cars classified by groups or categories when received filter by vehicle brand and type'
  );
});
