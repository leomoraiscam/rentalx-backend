import { getRepository, Repository } from 'typeorm';

import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
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
