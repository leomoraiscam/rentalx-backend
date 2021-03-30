import { inject, injectable } from 'tsyringe';

import Car from '@modules/cars/infra/typeorm/entities/Car';
import AppError from '@shared/errors/AppError';

import ICreateCarsDTO from '../../dtos/ICreateCarsDTO';
import ICarsRepository from '../../repositories/ICarsRepository';

// @injectable()
class CreateCarUseCase {
  constructor(
    // @inject('CarsRepository')
    private carsRepository: ICarsRepository
  ) {}

  async execute({
    name,
    description,
    daily_rate,
    license_plate,
    fine_amount,
    brand,
    category_id,
  }: ICreateCarsDTO): Promise<Car> {
    const carAlredyExist = await this.carsRepository.findByLicensePlate(
      license_plate
    );

    if (carAlredyExist) {
      throw new AppError('Car alredy exist', 400);
    }

    const car = await this.carsRepository.create({
      name,
      description,
      daily_rate,
      license_plate,
      fine_amount,
      brand,
      category_id,
    });

    return car;
  }
}

export default CreateCarUseCase;
