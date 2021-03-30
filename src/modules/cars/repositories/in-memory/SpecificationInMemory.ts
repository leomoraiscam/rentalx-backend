import Specification from '../../infra/typeorm/entities/Specification';
import ISpecificationsRepository from '../ISpecificationRepository';

interface ICreateSpecificationDTO {
  name: string;
  description: string;
}

class SpecificationInMemory implements ISpecificationsRepository {
  specification: Specification[] = [];

  async findByName(name: string): Promise<Specification> {
    const specification = this.specification.find(
      (specification) => specification.name === name
    );

    return specification;
  }
  async create({
    name,
    description,
  }: ICreateSpecificationDTO): Promise<Specification> {
    const specification = new Specification();

    Object.assign(specification, {
      name,
      description,
    });

    this.specification.push(specification);

    return specification;
  }

  async findByIds(ids: string[]): Promise<Specification[]> {
    const allSpecifications = this.specification.filter((specication) =>
      ids.includes(specication.id)
    );

    return allSpecifications;
  }
}

export default SpecificationInMemory;
