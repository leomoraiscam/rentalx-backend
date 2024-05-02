import { getRepository, Repository } from 'typeorm';

import { ICreateCarDTO } from '@modules/cars/dtos/ICreateCarDTO';
import { IQueryListAvailableCarsDTO } from '@modules/cars/dtos/IQueryListAvailableCarsDTO';
import { IUpdateAvailableStatusCarDTO } from '@modules/cars/dtos/IUpdateAvailableStatusCarDTO';
import { Car } from '@modules/cars/infra/typeorm/entities/Car';
import { ICarRepository } from '@modules/cars/repositories/ICarRepository';

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

  async findAvailable(data: IQueryListAvailableCarsDTO): Promise<Car[] | null> {
    const { brand, type } = data;

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
        'c.available',
        'c.licensePlate',
        'c.fineAmount',
        'c.brand',
        'c.categoryId',
        'category.name',
        'category.description',
        'category.type',
        'specifications.name',
        'specifications.description',
        'images.imageName',
      ]);

    if (brand) {
      carsQuery.where('c.brand = :brand', { brand });
    }

    // TODO: this filter does not operation, add functionality to begin operate
    if (type) {
      carsQuery.andWhere('c.category.type = :type', { type });
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
    } = data;

    const car = this.repository.create({
      name,
      description,
      brand,
      categoryId,
      dailyRate,
      fineAmount,
      licensePlate,
      specifications,
    });

    await this.repository.save(car);

    return car;
  }

  async save(car: Car): Promise<Car> {
    return this.repository.save(car);
  }

  async updateAvailable(data: IUpdateAvailableStatusCarDTO): Promise<void> {
    const { id, available } = data;

    await this.repository
      .createQueryBuilder()
      .update()
      .set({ available })
      .where('id = :id')
      .setParameters({ id })
      .execute();
  }
}
