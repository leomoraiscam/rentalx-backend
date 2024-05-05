import { CategoryType } from '@modules/cars/dtos/ICreateCategoryDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { AppError } from '@shared/errors/AppError';

import { UpdateRentalUseCase } from './UpdateRentalUseCase';

let inMemoryCategoryRepository: InMemoryCategoryRepository;
let inMemorySpecificationRepository: InMemorySpecificationRepository;
let inMemoryCarRepository: InMemoryCarRepository;
let inMemoryRentalRepository: InMemoryRentalRepository;
let inMemoryDateProvider: InMemoryDateProvider;
let updateRentalUseCase: UpdateRentalUseCase;
let category: Category;
let specification: Specification;
let car: Car;

describe('UpdateRentalUseCase', () => {
  beforeEach(async () => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    updateRentalUseCase = new UpdateRentalUseCase(
      inMemoryRentalRepository,
      inMemoryCarRepository,
      inMemoryDateProvider
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

  it('should be able to update start date and expect return date rental when received correct id', async () => {
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

    const updatedRental = await updateRentalUseCase.execute({
      id,
      startDate: new Date(2024, 2, 23),
      expectedReturnDate: new Date(2024, 2, 27),
    });

    expect(updatedRental.id).toEqual(id);
    expect(updatedRental.startDate).toEqual(new Date(2024, 2, 23));
    expect(updatedRental.expectedReturnDate).toEqual(new Date(2024, 2, 27));
  });

  it('should be able to update rental car when received correct id', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 2, 27).getTime();
    });

    const { id } = await inMemoryRentalRepository.create({
      carId: car.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
      status: 'confirmed',
    });

    const newCar = await inMemoryCarRepository.create({
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
    });

    const updatedRental = await updateRentalUseCase.execute({
      id,
      carId: newCar.id,
    });

    expect(updatedRental.id).toEqual(id);
    expect(updatedRental.carId).toEqual(newCar.id);
    expect(updatedRental.total).not.toEqual(1200);
    expect(updatedRental.total).toEqual(1800);
  });

  it('should not be able to update rental when rental a non exist', async () => {
    await expect(
      updateRentalUseCase.execute({
        id: 'fake-rental-id',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
