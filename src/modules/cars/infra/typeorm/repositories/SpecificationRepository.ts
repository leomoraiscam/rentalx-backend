import { getRepository, Repository } from 'typeorm';

import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import { IPaginationQueryResponseDTO } from '@modules/cars/dtos/IPaginationResponseDTO';
import { IQueryListCategoriesDTO } from '@modules/cars/dtos/IQueryListCategoriesDTO';
import { ISpecificationRepository } from '@modules/cars/repositories/ISpecificationRepository';

import { Specification } from '../entities/Specification';

export class SpecificationRepository implements ISpecificationRepository {
  private repository: Repository<Specification>;

  constructor() {
    this.repository = getRepository(Specification);
  }

  async findByName(name: string): Promise<Specification | null> {
    return this.repository.findOne({ name });
  }

  async findByIds(ids: string[]): Promise<Specification[] | null> {
    return this.repository.findByIds(ids);
  }

  async list(
    options?: IQueryListCategoriesDTO
  ): Promise<IPaginationQueryResponseDTO<Specification>> {
    const take = options.perPage || 10;
    const page = options.page || 1;
    const skip = (page - 1) * take;
    const order = options.order || 'DESC';

    const [result, total] = await this.repository.findAndCount({
      take,
      skip,
      order: {
        name: order,
      },
    });

    return {
      result,
      total,
    };
  }

  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = this.repository.create({
      name,
      description,
    });

    await this.repository.save(specification);

    return specification;
  }
}
