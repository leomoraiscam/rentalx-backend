import { ICreateCarAvailabilitiesDTO } from '@modules/cars/dtos/ICreateCarAvailabilitiesDTO';
import { CarAvailability } from '@modules/cars/infra/typeorm/entities/CarAvailability';

import { ICarAvailabilityRepository } from '../ICarAvailabilityRepository';

export class InMemoryCarAvailabilityRepository
  implements ICarAvailabilityRepository {
  private carAvailabilities: CarAvailability[] = [];

  async bulkCreate({
    inventory,
  }: ICreateCarAvailabilitiesDTO): Promise<CarAvailability[]> {
    return inventory.map((availability) => {
      const carAvailability = new CarAvailability();

      Object.assign(carAvailability, availability);

      this.carAvailabilities.push(carAvailability);

      return carAvailability;
    });
  }
}
