import {
  getRepository,
  LessThanOrEqual,
  MoreThanOrEqual,
  Repository,
} from 'typeorm';

import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';
import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';

export class RentalRepository implements IRentalRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findById(id: string): Promise<Rental | null> {
    return this.repository.findOne({
      where: {
        id,
      },
      relations: ['car', 'car.category', 'car.specifications', 'car.images'],
    });
  }

  async findByUser(userId: string): Promise<Rental[] | null> {
    return this.repository.find({
      where: {
        userId,
      },
      relations: ['car'],
    });
  }

  async findOpenRentalByCar(carId: string): Promise<Rental | undefined> {
    return this.repository.findOne({
      where: {
        carId,
        endDate: null,
      },
    });
  }

  async findByCarAndDateRange(
    data: IQueryListCarsDTO
  ): Promise<Rental | undefined> {
    const { carId, startDate, expectedReturnDate } = data;

    const rental = await this.repository.findOne({
      where: {
        carId,
        startDate: LessThanOrEqual(expectedReturnDate),
        expectedReturnDate: MoreThanOrEqual(startDate),
      },
    });

    return rental;
  }

  async findActiveRentalByUser(userId: string): Promise<Rental> {
    return this.repository.findOne({
      where: {
        userId,
        endDate: null,
      },
    });
  }

  async create(data: ICreateRentalDTO): Promise<Rental> {
    const {
      carId,
      userId,
      expectedReturnDate,
      id,
      endDate,
      total,
      startDate,
      status,
    } = data;

    const rental = this.repository.create({
      carId,
      userId,
      expectedReturnDate,
      id,
      endDate,
      total,
      startDate,
      status,
    });

    await this.repository.save(rental);

    return rental;
  }

  async save(data: Rental): Promise<Rental> {
    return this.repository.save(data);
  }
}
