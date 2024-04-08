import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';

import { Specification } from '../../infra/typeorm/entities/Specification';
import { ISpecificationRepository } from '../ISpecificationRepository';

export class InMemorySpecificationRepository
  implements ISpecificationRepository {
  private specifications: Specification[] = [];

  async findByName(name: string): Promise<Specification | null> {
    return this.specifications.find(
      (specification) => specification.name === name
    );
  }

  async findByIds(ids: string[]): Promise<Specification[] | null> {
    return this.specifications.filter((specification) =>
      ids.includes(specification.id)
    );
  }

  async create(data: ICreateSpecificationDTO): Promise<Specification> {
    const { name, description } = data;

    const specification = new Specification();

    Object.assign(specification, {
      name,
      description,
    });

    this.specifications.push(specification);

    return specification;
  }
}
