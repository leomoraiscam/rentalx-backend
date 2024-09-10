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

import { IListRentalsDTO } from '../../../dtos/IListRentalsDTO';
import { IPaginationQueryResponseDTO } from '../../../dtos/IPaginationResponseDTO';

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

  async list(
    options: IListRentalsDTO
  ): Promise<IPaginationQueryResponseDTO<Rental>> {
    const {
      page,
      perPage: take,
      order,
      status,
      startDate,
      endDate,
      categoryIds,
    } = options;

    const skip = (page - 1) * take;
    const queryBuilder = this.repository
      .createQueryBuilder('rental')
      .select([
        'rental.id',
        'rental.carId',
        'rental.userId',
        'rental.endDate',
        'rental.expectedReturnDate',
        'rental.total',
        'rental.createdAt',
        'rental.startDate',
        'rental.updatedAt',
        'rental.status',
      ])
      .leftJoinAndSelect('rental.car', 'car');

    if (status && status.length > 0) {
      queryBuilder.andWhere('rental.status IN (:...status)', { status });
    }

    if (startDate && endDate) {
      queryBuilder.andWhere(
        'rental.startDate BETWEEN :startDate AND :endDate',
        {
          startDate,
          endDate,
        }
      );
    }

    if (categoryIds) {
      queryBuilder.andWhere('car.category_id IN (:...categoryIds)', {
        categoryIds,
      });
    }

    const [result, total] = await queryBuilder
      .skip(skip)
      .take(take)
      .orderBy('rental.startDate', order)
      .getManyAndCount();

    return {
      result,
      total,
    };
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
