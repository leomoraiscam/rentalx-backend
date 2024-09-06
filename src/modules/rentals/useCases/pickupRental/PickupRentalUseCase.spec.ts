import { CarStatus } from '@modules/cars/enums/CarStatus';
import { CategoryType } from '@modules/cars/enums/CategoryType';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { RentalStatus } from '@modules/rentals/enums/RentatStatus';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { AppError } from '@shared/errors/AppError';

import { PickupRentalUseCase } from './PickupRentalUseCase';

describe('PickupRentalUseCase', () => {
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let inMemorySpecificationRepository: InMemorySpecificationRepository;
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let pickupRentalUseCase: PickupRentalUseCase;
  let category: Category;
  let specification: Specification;
  let car: Car;

  beforeEach(async () => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    pickupRentalUseCase = new PickupRentalUseCase(
      inMemoryRentalRepository,
      inMemoryCarRepository
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

  it('should be able to picked up and update status of rental when received correct data', async () => {
    const spiedRentalSaveMethod = jest.spyOn(inMemoryRentalRepository, 'save');
    const spiedCarSaveMethod = jest.spyOn(inMemoryCarRepository, 'save');

    const rental = await inMemoryRentalRepository.create({
      carId: car.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
      car,
      status: RentalStatus.CONFIRMED,
    });

    await pickupRentalUseCase.execute(rental.id);

    expect(spiedRentalSaveMethod).toHaveBeenNthCalledWith(1, {
      ...rental,
      status: RentalStatus.PICKED_UP,
    });
    expect(spiedCarSaveMethod).toHaveBeenNthCalledWith(1, {
      ...car,
      status: CarStatus.RENTED,
    });
  });

  it('should not be able to picked up rental and update status when status is different from confirmed', async () => {
    const { id } = await inMemoryRentalRepository.create({
      carId: car.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
      car,
      status: RentalStatus.CLOSED,
    });

    await expect(pickupRentalUseCase.execute(id)).rejects.toBeInstanceOf(
      AppError
    );
  });

  it('should not be able to picked up rental and update status when the same a non exist', async () => {
    await expect(pickupRentalUseCase.execute('fake-id')).rejects.toBeInstanceOf(
      AppError
    );
  });
});
