import { injectable, inject } from 'tsyringe';

import { ICreateCarSpecificationsDTO } from '@modules/cars/dtos/ICreateCarSpecificationsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class CreateCarSpecificationsUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository
  ) {}

  async execute({
    carId,
    specificationsIds,
  }: ICreateCarSpecificationsDTO): Promise<Car> {
    const car = await this.carRepository.findById(carId);

    if (!car) {
      throw new AppError('car not found', 404);
    }

    const specifications = await this.specificationRepository.findByIds(
      specificationsIds
    );

    Object.assign(car, {
      specifications,
    });

    return this.carRepository.save(car);
  }
}
