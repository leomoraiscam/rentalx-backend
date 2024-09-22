import { inject, injectable } from 'tsyringe';

import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICategoryRepository } from '@modules/cars/repositories/ICategoryRepository';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';
import { AppError } from '@shared/errors/AppError';

import { ICreateCarDTO } from '../../dtos/ICreateCarDTO';
import { ICarRepository } from '../../repositories/ICarRepository';

@injectable()
export class CreateCarUseCase {
  constructor(
    @inject('CarRepository')
    private carRepository: ICarRepository,
    @inject('CategoryRepository')
    private categoryRepository: ICategoryRepository,
    @inject('SpecificationRepository')
    private specificationRepository: ISpecificationRepository
  ) {}

  async execute(data: ICreateCarDTO): Promise<Car> {
    const {
      name,
      description,
      dailyRate,
      licensePlate,
      fineAmount,
      brand,
      categoryId,
      specifications,
      status,
    } = data;
    const category = await this.categoryRepository.findById(categoryId);

    if (!category) {
      throw new AppError('Category not found', 404);
    }

    const car = await this.carRepository.findByLicensePlate(licensePlate);

    if (car) {
      throw new AppError('Car with this licensePlate already exist', 409);
    }

    const specificationsInstancies = await this.specificationRepository.findByIds(
      specifications as string[]
    );

    return this.carRepository.create({
      name,
      description,
      dailyRate,
      licensePlate,
      fineAmount,
      brand,
      categoryId,
      specifications: specificationsInstancies,
      status,
    });
  }
}
