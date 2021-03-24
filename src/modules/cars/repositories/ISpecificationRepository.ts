import Specification from '../entities/Specification';

interface ICreateSpecification {
  name: string;
  description: string;
}

interface ISpecificationRepository {
  findByName(name: string): Promise<Specification>;
  create(data: ICreateSpecification): Promise<void>;
}

export default ISpecificationRepository;
