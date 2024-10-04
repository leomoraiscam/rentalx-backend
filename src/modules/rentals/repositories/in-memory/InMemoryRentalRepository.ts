import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';
import { IPaginationQueryResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';

import { ICreateRentalDTO } from '../../dtos/ICreateRentalDTO';
import { IListRentalsDTO } from '../../dtos/IListRentalsDTO';
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

  async findByCarAndDateRange({
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

  async findActiveRentalByUser(userId: string): Promise<Rental | undefined> {
    return this.rentals.find(
      (rental) => rental.userId === userId && !rental.endDate
    );
  }

  async list(
    options: IListRentalsDTO
  ): Promise<IPaginationQueryResponseDTO<Rental>> {
    let filteredRentals = [...this.rentals];
    const {
      order,
      page,
      perPage: take,
      status,
      startDate,
      endDate,
      categoryIds,
    } = options;

    if (status) {
      filteredRentals = filteredRentals.filter((rental) =>
        status.includes(rental.status)
      );
    }

    if (startDate && endDate) {
      filteredRentals = filteredRentals.filter(
        (rental) => rental.startDate >= startDate && rental.startDate <= endDate
      );
    }

    if (categoryIds) {
      filteredRentals = filteredRentals.filter((rental) =>
        categoryIds.includes(rental?.car?.categoryId)
      );
    }

    if (order === 'ASC') {
      filteredRentals = filteredRentals.sort(
        (a, b) => a.startDate.getTime() - b.startDate.getTime()
      );
    } else if (order === 'DESC') {
      filteredRentals = filteredRentals.sort(
        (a, b) => b.startDate.getTime() - a.startDate.getTime()
      );
    }

    const startIndex = (page - 1) * take;
    const endIndex = startIndex + take;
    const data = filteredRentals.slice(startIndex, endIndex);

    return {
      result: data,
      total: this.rentals.length,
    };
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
