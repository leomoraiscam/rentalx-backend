import { inject, injectable } from 'tsyringe';

import { ICreateCarAvailabilitiesDTO } from '@modules/cars/dtos/ICreateCarAvailabilitiesDTO';
import { CarAvailability } from '@modules/cars/infra/typeorm/entities/CarAvailability';
import { ICarAvailabilityRepository } from '@modules/cars/repositories/ICarAvailabilityRepository';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class CreateInventoryToCarsUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('CarAvailabilityRepository')
    private carAvailabilityRepository: ICarAvailabilityRepository
  ) {}

  async execute({
    inventory,
  }: ICreateCarAvailabilitiesDTO): Promise<CarAvailability[]> {
    const hasCarsWithSameIdRequests = inventory.some((car, _, self) => {
      const filterList = self.filter(
        (selfData) => selfData.carId === car.carId
      );

      return filterList.length !== 1;
    });

    if (hasCarsWithSameIdRequests) {
      throw new AppError('Duplicate cars', 409);
    }

    const checkIfExistedCar = inventory.map(async ({ carId }) => {
      const car = await this.carRepository.findById(carId);

      if (!car) {
        throw new AppError('Car not found', 404);
      }

      return car;
    });

    await Promise.all(checkIfExistedCar);

    return this.carAvailabilityRepository.bulkCreate({ inventory });
  }
}
