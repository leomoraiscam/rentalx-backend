import { CategoryType } from '@modules/cars/dtos/ICreateCategoryDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { Category } from '@modules/cars/infra/typeorm/entities/Category';
import { Specification } from '@modules/cars/infra/typeorm/entities/Specification';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { InMemoryCategoryRepository } from '@modules/cars/repositories/in-memory/InMemoryCategoryRepository';
import { InMemorySpecificationRepository } from '@modules/cars/repositories/in-memory/InMemorySpecificationRepository';
import { RentalStatus } from '@modules/rentals/dtos/enums/RentatStatus';
import { InMemoryRentalRepository } from '@modules/rentals/repositories/in-memory/InMemoryRentalRepository';

import { UpdateStatusRentalUseCase } from './UpdateStatusRentalUseCase';

describe('UpdateStatusRentalUseCase', () => {
  let inMemoryCategoryRepository: InMemoryCategoryRepository;
  let inMemorySpecificationRepository: InMemorySpecificationRepository;
  let inMemoryCarRepository: InMemoryCarRepository;
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let updateStatusRentalUseCase: UpdateStatusRentalUseCase;
  let category: Category;
  let specification: Specification;
  let car: Car;

  beforeEach(async () => {
    inMemoryCategoryRepository = new InMemoryCategoryRepository();
    inMemorySpecificationRepository = new InMemorySpecificationRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    inMemoryRentalRepository = new InMemoryRentalRepository();
    updateStatusRentalUseCase = new UpdateStatusRentalUseCase(
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
    const updatedRental = await updateStatusRentalUseCase.execute({
      id,
      status: RentalStatus.CONFIRMED,
    });

    expect(updatedRental.id).toEqual(id);
    expect(updatedRental.status).toEqual(RentalStatus.CONFIRMED);
    expect(updatedRental.status).not.toEqual(RentalStatus.PENDING);
  });

  it('should be able to update status rental when the same has canceled', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 2, 27).getTime();
    });

    const { id } = await inMemoryRentalRepository.create({
      carId: car.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
    });
    const updatedRental = await updateStatusRentalUseCase.execute({
      id,
      status: RentalStatus.CANCELED,
    });

    expect(updatedRental.id).toEqual(id);
    expect(updatedRental.status).toEqual(RentalStatus.CANCELED);
    expect(updatedRental.status).not.toEqual(RentalStatus.CONFIRMED);
    expect(updatedRental.status).not.toEqual(RentalStatus.PENDING);
  });

  it('should be able to update status rental when the same has pending', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 2, 27).getTime();
    });

    const { id } = await inMemoryRentalRepository.create({
      carId: car.id,
      startDate: new Date(2024, 2, 20),
      expectedReturnDate: new Date(2024, 2, 23),
      userId: 'fake-user-id',
    });

    const updatedRental = await updateStatusRentalUseCase.execute({
      id,
      status: RentalStatus.PENDING,
    });

    expect(updatedRental.id).toEqual(id);
    expect(updatedRental.status).toEqual(RentalStatus.PENDING);
    expect(updatedRental.status).not.toEqual(RentalStatus.CONFIRMED);
    expect(updatedRental.status).not.toEqual(RentalStatus.CONFIRMED);
  });
});
