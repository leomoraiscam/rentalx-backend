import { Repository, getRepository } from 'typeorm';

import { ICreateCarAvailabilitiesDTO } from '@modules/cars/dtos/ICreateCarAvailabilitiesDTO';
import { ICarAvailabilityRepository } from '@modules/cars/repositories/ICarAvailabilityRepository';

import { CarAvailability } from '../entities/CarAvailability';

export class CarAvailabilityRepository implements ICarAvailabilityRepository {
  private repository: Repository<CarAvailability>;

  constructor() {
    this.repository = getRepository(CarAvailability);
  }

  async bulkCreate({
    inventory,
  }: ICreateCarAvailabilitiesDTO): Promise<CarAvailability[]> {
    const inventoryToSave = inventory.map(({ carId, quantity }) =>
      this.repository.create({
        carId,
        availableQuantity: quantity,
      })
    );

    await this.repository.save(inventoryToSave);

    return inventoryToSave;
  }
}
