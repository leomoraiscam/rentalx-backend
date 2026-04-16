import { CarStatus } from '@modules/cars/enums/carStatus';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { InMemoryCarRepository } from '@modules/cars/repositories/in-memory/InMemoryCarRepository';
import { RentalStatus } from '@modules/rentals/enums/rentalStatus';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { FindOptionsOrdernation } from '@shared/common/enums/findOptionsOrder';

import { InMemoryRentalRepository } from '../../repositories/in-memory/InMemoryRentalRepository';
import { ListRentalsUseCase } from './ListRentalsUseCase';

describe('ListRentalsUseCase', () => {
  let inMemoryRentalRepository: InMemoryRentalRepository;
  let inMemoryCarRepository: InMemoryCarRepository;
  let listRentalsUseCase: ListRentalsUseCase;
  let rentals: Rental[];
  let firstCar: Car;
  let secondCar: Car;

  beforeEach(async () => {
    inMemoryRentalRepository = new InMemoryRentalRepository();
    inMemoryCarRepository = new InMemoryCarRepository();
    listRentalsUseCase = new ListRentalsUseCase(inMemoryRentalRepository);

    [firstCar, secondCar] = await Promise.all([
      inMemoryCarRepository.create({
        name: 'Mustang',
        brand: 'Ford',
        description: 'Ford Mustang',
        dailyRate: 400,
        licensePlate: 'DJA-002',
        fineAmount: 400,
        categoryId: 'faked-suv-category',
        specifications: [
          {
            id: 'fake-id',
            createdAt: new Date(),
            description: 'fake-description',
            name: 'fake-name',
          },
        ],
        images: [
          {
            id: 'fake-id',
            imageName: 'fake-image',
            createdAt: new Date(),
          },
        ],
        status: CarStatus.Available,
      }),
      inMemoryCarRepository.create({
        name: 'Mustang',
        brand: 'Ford',
        description: 'Ford Mustang',
        dailyRate: 400,
        licensePlate: 'DJA-002',
        fineAmount: 400,
        categoryId: 'faked-sport-category',
        specifications: [
          {
            id: 'fake-id',
            createdAt: new Date(),
            description: 'fake-description',
            name: 'fake-name',
          },
        ],
        images: [
          {
            id: 'fake-id',
            imageName: 'fake-image',
            createdAt: new Date(),
          },
        ],
        status: CarStatus.Available,
      }),
    ]);

    rentals = await Promise.all([
      inMemoryRentalRepository.create({
        carId: firstCar.id,
        car: firstCar,
        startDate: new Date(2024, 2, 20, 10),
        expectedReturnDate: new Date(2024, 2, 23),
        userId: 'fake-user-id',
        status: RentalStatus.Confirmed,
      }),
      inMemoryRentalRepository.create({
        carId: 'other-car-id',
        car: ({
          id: 'other-car-id',
          brand: 'Other',
          name: 'Other',
          licensePlate: 'ABC-000',
          categoryId: 'other-category',
          images: [],
        } as unknown) as Car,
        startDate: new Date(2024, 2, 21, 10),
        expectedReturnDate: new Date(2024, 2, 23),
        userId: 'fake-user-id',
        status: RentalStatus.Confirmed,
      }),
      inMemoryRentalRepository.create({
        carId: 'other-car-id',
        car: ({
          id: 'other-car-id',
          brand: 'Other',
          name: 'Other',
          licensePlate: 'ABC-000',
          categoryId: 'other-category',
          images: [],
        } as unknown) as Car,
        startDate: new Date(2024, 2, 22, 10),
        expectedReturnDate: new Date(2024, 2, 23),
        userId: 'fake-user-id',
        status: RentalStatus.Closed,
      }),
      inMemoryRentalRepository.create({
        carId: secondCar.id,
        car: secondCar,
        startDate: new Date(2024, 2, 20, 11),
        expectedReturnDate: new Date(2024, 2, 23),
        userId: 'fake-user-id',
        status: RentalStatus.Overdue,
      }),
      inMemoryRentalRepository.create({
        carId: secondCar.id,
        car: secondCar,
        startDate: new Date(2024, 2, 20, 12),
        expectedReturnDate: new Date(2024, 2, 23),
        userId: 'fake-user-id',
        status: RentalStatus.PickedUp,
      }),
    ]);
  });

  it('should be able to return an rentals list with default parameters when a non received parameters', async () => {
    const { data, totalPages } = await listRentalsUseCase.execute({});

    expect(data).toHaveLength(5);
    expect(totalPages).toBe(1);
  });

  it('should be able to return an rentals list with fourth objects when a received page and perPage parameters', async () => {
    const { data, totalPages, total } = await listRentalsUseCase.execute({
      page: 1,
      perPage: 4,
    });

    expect(data).toHaveLength(4);
    expect(total).toBe(5);
    expect(totalPages).toBe(2);
  });

  it('should be able to return an rentals list with two objects when a received page and perPage parameters', async () => {
    const { data, totalPages, total } = await listRentalsUseCase.execute({
      page: 1,
      perPage: 2,
    });

    expect(data).toHaveLength(2);
    expect(total).toBe(5);
    expect(totalPages).toBe(3);
  });

  it('should be able to return an rentals list with rentals sorted when received order parameter', async () => {
    const { data } = await listRentalsUseCase.execute({
      page: 1,
      perPage: 10,
      order: FindOptionsOrdernation.Desc,
    });

    expect(data).toHaveLength(5);
    expect(data[0].id).toEqual(rentals[2].id);
    expect(data[1].id).toEqual(rentals[1].id);
    expect(data[2].id).toEqual(rentals[4].id);
    expect(data[3].id).toEqual(rentals[3].id);
    expect(data[4].id).toEqual(rentals[0].id);
  });

  it('should be able to return only rentals with status PICKED_UP when received status parameter', async () => {
    const { data } = await listRentalsUseCase.execute({
      page: 1,
      perPage: 10,
      order: FindOptionsOrdernation.Desc,
      status: [RentalStatus.PickedUp, RentalStatus.Confirmed].toString(),
    });

    expect(data).toHaveLength(3);
  });

  it('should be able to return rentals with date range when received an period of date in parameters', async () => {
    const { data } = await listRentalsUseCase.execute({
      page: 1,
      perPage: 10,
      order: FindOptionsOrdernation.Desc,
      startDate: new Date(2024, 2, 21, 8),
      endDate: new Date(2024, 2, 22, 18),
    });

    expect(data).toHaveLength(2);
  });

  it('should be able to return rentals list with an specific category when there received one category in the parameters', async () => {
    const { data } = await listRentalsUseCase.execute({
      page: 1,
      perPage: 10,
      order: FindOptionsOrdernation.Desc,
      categoryIds: 'faked-sport-category',
    });

    expect(data).toHaveLength(2);
  });

  it('should be able to return rentals list with specifics categories when there are multiple categories received in the parameters', async () => {
    const { data } = await listRentalsUseCase.execute({
      page: 1,
      perPage: 10,
      order: FindOptionsOrdernation.Desc,
      categoryIds: 'faked-sport-category,faked-suv-category',
    });

    expect(data).toHaveLength(3);
  });
});
