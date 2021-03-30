import { injectable, inject } from 'tsyringe';

import Car from '@modules/cars/infra/typeorm/entities/Car';
import ICarsRepository from '@modules/cars/repositories/ICarsRepository';
import ISpecificationRepository from '@modules/cars/repositories/ISpecificationRepository';
import AppError from '@shared/errors/AppError';

interface IRequest {
  car_id: string;
  specifications_id: string[];
}

@injectable()
class CreateCarsSpecificationsUseCase {
  constructor(
    @inject('CarsRepository')
    private carsRepository: ICarsRepository,
    @inject('SpecificationsRepository')
    private specificationsRepository: ISpecificationRepository
  ) {}

  async execute({ car_id, specifications_id }: IRequest): Promise<Car> {
    const carsExist = await await this.carsRepository.findById(car_id);

    if (!carsExist) {
      throw new AppError('Car does not exist!');
    }

    const specifications = await this.specificationsRepository.findByIds(
      specifications_id
    );

    carsExist.specifications = specifications;

    await this.carsRepository.create(carsExist);

    return carsExist;
  }
}

export default CreateCarsSpecificationsUseCase;
