import { getRepository, Repository } from 'typeorm';

import { ICreateRentalDTO } from '@modules/rentals/dtos/ICreateRentalDTO';
import { Rental } from '@modules/rentals/infra/typeorm/entities/Rental';
import { IRentalRepository } from '@modules/rentals/repositories/IRentalRepository';

export class RentalRepository implements IRentalRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findById(id: string): Promise<Rental | null> {
    return this.repository.findOne(id);
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

  async findOpenRentalByUser(userId: string): Promise<Rental> {
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
}
