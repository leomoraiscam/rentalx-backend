import { ICreateSpecificationDTO } from '@modules/cars/dtos/ICreateSpecificationDTO';
import { IPaginationQueryResponseDTO } from '@modules/cars/dtos/IPaginationResponseDTO';
import { IQueryListCategoriesDTO } from '@modules/cars/dtos/IQueryListCategoriesDTO';

import { Specification } from '../../infra/typeorm/entities/Specification';
import { ISpecificationRepository } from '../ISpecificationRepository';

export class InMemorySpecificationRepository
  implements ISpecificationRepository {
  private specifications: Specification[] = [];

  async findByName(name: string): Promise<Specification> {
    return this.specifications.find(
      (specification) => specification.name === name
    );
  }

  async findByIds(ids: string[]): Promise<Specification[] | null> {
    return this.specifications.filter((specification) =>
      ids.includes(specification.id)
    );
  }

  async list(
    options: IQueryListCategoriesDTO
  ): Promise<IPaginationQueryResponseDTO<Specification>> {
    let sortedSpecifications = this.specifications;

    const take = options.perPage || 10;
    const page = options.page || 1;
    const order = options.order || 'DESC';

    if (order === 'ASC') {
      sortedSpecifications = sortedSpecifications.sort((a, b) =>
        a.name.localeCompare(b.name)
      );
    } else if (order === 'DESC') {
      sortedSpecifications = sortedSpecifications.sort((a, b) =>
        b.name.localeCompare(a.name)
      );
    }

    const startIndex = (page - 1) * take;
    const endIndex = startIndex + take;

    const data = sortedSpecifications.slice(startIndex, endIndex);

    return {
      result: data,
      total: this.specifications.length,
    };
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
