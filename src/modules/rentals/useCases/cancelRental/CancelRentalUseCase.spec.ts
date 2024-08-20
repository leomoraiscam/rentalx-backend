import { CategoryType } from '@modules/cars/enums/category';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { RentalStatus } from '@modules/rentals/dtos/enums/RentatStatus';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { AppError } from '@shared/errors/AppError';

import { CancelRentalUseCase } from './CancelRentalUseCase';

let inMemoryCategoryRepository: InMemoryCategoryRepository;
let inMemorySpecificationRepository: InMemorySpecificationRepository;
let inMemoryCarRepository: InMemoryCarRepository;
let inMemoryRentalRepository: InMemoryRentalRepository;
let cancelRentalUseCase: CancelRentalUseCase;
let category: Category;
let specification: Specification;
let car: Car;

describe('CancelUseCase', () => {
  beforeEach(async () => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    cancelRentalUseCase = new CancelRentalUseCase(inMemoryRentalRepository);

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

  it('should be able to update status rental when the same has confirmed', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 2, 27).getTime();
    });

    const { id } = await inMemoryRentalRepository.create({
      carId: car.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
    });

    const updatedRental = await cancelRentalUseCase.execute(id);

    expect(updatedRental.id).toEqual(id);
    expect(updatedRental.status).toEqual(RentalStatus.CANCELED);
    expect(updatedRental.status).not.toEqual(RentalStatus.PENDING);
    expect(updatedRental.status).not.toEqual(RentalStatus.CONFIRMED);
  });

  it('should not be able to update status rental when the same a non exist', async () => {
    await expect(cancelRentalUseCase.execute('fake-id')).rejects.toBeInstanceOf(
      AppError
    );
  });
});
