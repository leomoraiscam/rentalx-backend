import { injectable, inject } from 'tsyringe';

import { IQueryListAvailableCarsDTO } from '@modules/cars/dtos/IQueryListAvailableCarsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';

@injectable()
export class ListAvailableCarsUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository
  ) {}

  async execute({
    categoryId,
    brand,
    name,
  }: IQueryListAvailableCarsDTO): Promise<Car[]> {
    return this.carRepository.findAvailable({ brand, categoryId, name });
  }
}
