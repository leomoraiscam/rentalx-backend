import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';

import { ICreateRentalDTO } from '../../dtos/ICreateRentalDTO';
import { Rental } from '../../infra/typeorm/entities/Rental';
import { IRentalRepository } from '../IRentalRepository';

export class InMemoryRentalRepository implements IRentalRepository {
  private rentals: Rental[] = [];

  async findById(id: string): Promise<Rental | null> {
    return this.rentals.find((rental) => rental.id === id);
  }

  async findByUser(userId: string): Promise<Rental[] | null> {
    return this.rentals.filter((rental) => rental.userId === userId);
  }

  async findOpenRentalByCar(carId: string): Promise<Rental | null> {
    return this.rentals.find(
      (rental) => rental.carId === carId && !rental.endDate
    );
  }

  async findOpenRentalByDateAndCar({
    startDate,
    expectedReturnDate,
    carId,
  }: IQueryListCarsDTO): Promise<Rental | null> {
    return this.rentals.find((rental) => {
      return (
        rental.carId === carId &&
        rental.startDate <= expectedReturnDate &&
        rental.expectedReturnDate >= startDate
      );
    });
  }

  async findOpenRentalByUser(userId: string): Promise<Rental | undefined> {
    return this.rentals.find(
      (rental) => rental.userId === userId && !rental.endDate
    );
  }

  async create(data: ICreateRentalDTO): Promise<Rental> {
    const { carId, userId, expectedReturnDate, startDate, status, car } = data;

    const rental = new Rental();

    Object.assign(rental, {
      carId,
      userId,
      expectedReturnDate,
      startDate,
      endDate: null,
      status,
      car,
    });

    this.rentals.push(rental);

    return rental;
  }

  async save(data: Rental): Promise<Rental> {
    const rentalIndex = this.rentals.findIndex(
      (rental) => rental.id === data.id
    );

    this.rentals[rentalIndex] = data;

    return data;
  }
}
