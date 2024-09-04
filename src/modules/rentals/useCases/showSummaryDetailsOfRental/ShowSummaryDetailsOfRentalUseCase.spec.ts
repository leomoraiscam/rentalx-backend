import { CategoryType } from '@modules/cars/enums/CategoryType';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { AppError } from '@shared/errors/AppError';

import { ShowSummaryDetailsOfRentalUseCase } from './ShowSummaryDetailsOfRentalUseCase';

let inMemoryCategoryRepository: InMemoryCategoryRepository;
let inMemorySpecificationRepository: InMemorySpecificationRepository;
let inMemoryCarRepository: InMemoryCarRepository;
let inMemoryRentalRepository: InMemoryRentalRepository;
let inMemoryDateProvider: InMemoryDateProvider;
let showSummaryDetailsOfRentalUseCase: ShowSummaryDetailsOfRentalUseCase;
let car: Car;

describe('ShowSummaryDetailsOfRentalUseCase', () => {
  beforeEach(async () => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    showSummaryDetailsOfRentalUseCase = new ShowSummaryDetailsOfRentalUseCase(
      inMemoryRentalRepository,
      inMemoryDateProvider
    );

    const category = await inMemoryCategoryRepository.create({
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

    car = await inMemoryCarRepository.create({
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
  });

  it('should be able to return details of rental when received correct id', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 2, 27).getTime();
    });

    const { id } = await inMemoryRentalRepository.create({
      carId: car.id,
      car,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
    });

    const rentalDetails = await showSummaryDetailsOfRentalUseCase.execute(id);

    expect(rentalDetails).toHaveProperty('car');
    expect(rentalDetails).toHaveProperty('offer');
  });

  it('should not be able to return details of rental when rental a non exist', async () => {
    await expect(
      showSummaryDetailsOfRentalUseCase.execute('fake-rental-id')
    ).rejects.toBeInstanceOf(AppError);
  });
});
