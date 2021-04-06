import { getRepository, Repository } from 'typeorm';

import ICreaterentalDTO from '@modules/rentals/dtos/ICreateRentalDTO';
import Rental from '@modules/rentals/infra/typeorm/entities/Rentals';
import IRentalsRepository from '@modules/rentals/repositories/IRentalsRepository';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findById(id: string) {
    const rental = await this.repository.findOne(id);

    return rental;
  }

  async findByUser(user_id: string): Promise<Rental[]> {
    const rentals = await this.repository.find({
      where: {
        user_id,
      },
      relations: ['car'],
    });

    return rentals;
  }

  async findOpebRentalByCar(car_id: string): Promise<Rental> {
    const openBycar = await this.repository.findOne({ car_id, end_date: null });

    return openBycar;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const openByUser = this.repository.findOne({
      where: {
        user_id,
        end_date: null,
      },
    });

    return openByUser;
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
    id,
    end_date,
    total,
  }: ICreaterentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      user_id,
      expected_return_date,
      id,
      end_date,
      total,
    });

    await this.repository.save(rental);

    return rental;
  }
}

export default RentalsRepository;
