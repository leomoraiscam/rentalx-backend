import { getRepository, Repository } from 'typeorm';

import ICreaterentalDTO from '@modules/rentals/dtos/ICreateRentalDTO';
import Rental from '@modules/rentals/infra/typeorm/entities/Rentals';
import IRentalsRepository from '@modules/rentals/repositories/IRentalsRepository';

class RentalsRepository implements IRentalsRepository {
  private repository: Repository<Rental>;

  constructor() {
    this.repository = getRepository(Rental);
  }

  async findOpebRentalByCar(car_id: string): Promise<Rental> {
    const openBycar = await this.repository.findOne({ car_id });

    return openBycar;
  }

  async findOpenRentalByUser(user_id: string): Promise<Rental> {
    const openByUser = this.repository.findOne({
      user_id,
    });

    return openByUser;
  }

  async create({
    car_id,
    user_id,
    expected_return_date,
  }: ICreaterentalDTO): Promise<Rental> {
    const rental = this.repository.create({
      car_id,
      user_id,
      expected_return_date,
    });

    await this.repository.save(rental);

    return rental;
  }
}

export default RentalsRepository;
