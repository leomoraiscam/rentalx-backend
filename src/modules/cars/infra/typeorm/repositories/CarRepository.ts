import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IQueryListCarsDTO } from '@modules/cars/dtos/IQueryListCarsDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';

import { Specification } from '../entities/Specification';

export class CarRepository implements ICarRepository {
  private repository: Repository<Car>;

  constructor() {
    this.repository = getRepository(Car);
  }

  async findById(id: string): Promise<Car | null> {
    return this.repository.findOne(id);
  }

  async findByLicensePlate(licensePlate: string): Promise<Car | null> {
    return this.repository.findOne({ licensePlate });
  }

  async list(data: IQueryListCarsDTO): Promise<Car[]> {
    const { brand, categoryId, type } = data;
    const carsQuery = this.repository
      .createQueryBuilder('c')
      .leftJoinAndSelect('c.category', 'category')
      .leftJoinAndSelect('c.specifications', 'specifications')
      .leftJoinAndSelect('c.images', 'images')
      .select([
        'c.id',
        'c.name',
        'c.description',
        'c.dailyRate',
        'c.licensePlate',
        'c.fineAmount',
        'c.brand',
        'c.status',
        'c.categoryId',
        'category.id',
        'category.name',
        'category.description',
        'category.type',
        'specifications.id',
        'specifications.name',
        'specifications.description',
        'images.id',
        'images.imageName',
      ]);

    if (brand) {
      carsQuery.where('c.brand = :brand', { brand });
    }

    if (type) {
      carsQuery.andWhere('category.type = :type', { type });
    }

    if (categoryId) {
      carsQuery.andWhere('c.categoryId = :categoryId', { categoryId });
    }

    const cars = await carsQuery.getMany();

    return cars;
  }

  async create(data: ICreateCarDTO): Promise<Car> {
    const {
      name,
      description,
      brand,
      categoryId,
      dailyRate,
      fineAmount,
      licensePlate,
      specifications,
      status,
    } = data;
    const specificationsEntity = specifications as Specification[];
    const car = this.repository.create({
      name,
      description,
      brand,
      categoryId,
      dailyRate,
      fineAmount,
      licensePlate,
      specifications: specificationsEntity,
      status,
    });

    await this.repository.save(car);

    return car;
  }

  async save(data: Car): Promise<void> {
    await this.repository.save(data);
  }
}
