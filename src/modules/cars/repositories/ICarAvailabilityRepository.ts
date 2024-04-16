import { ICreateCarAvailabilitiesDTO } from '../dtos/ICreateCarAvailabilitiesDTO';
import { CarAvailability } from '../infra/typeorm/entities/CarAvailability';

export interface ICarAvailabilityRepository {
  bulkCreate(data: ICreateCarAvailabilitiesDTO): Promise<CarAvailability[]>;
}
