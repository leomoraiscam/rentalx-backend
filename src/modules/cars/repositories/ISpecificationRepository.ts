import Specification from '../infra/typeorm/entities/Specification';

interface ICreateSpecification {
  name: string;
  description: string;
}

interface ISpecificationRepository {
  findByName(name: string): Promise<Specification>;
  create(data: ICreateSpecification): Promise<Specification>;
  findByIds(ids: string[]): Promise<Specification[]>;
}

export default ISpecificationRepository;
