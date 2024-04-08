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
    const { brand, categoryId, name } = data;

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
        'category.name',
        'category.description',
        'specifications.name',
        'specifications.description',
        'images.imageName',
      ])
      .where('available = :available', { available: true });

    if (name) {
      carsQuery.andWhere('c.name = :name', { name });
    }

    if (brand) {
      carsQuery.andWhere('c.brand = :brand', { brand });
    }

    if (categoryId) {
      carsQuery.andWhere('c.category_id = :category_id', { categoryId });
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
