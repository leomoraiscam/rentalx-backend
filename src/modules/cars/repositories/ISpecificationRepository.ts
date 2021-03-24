import Specification from '../models/Specification';

interface ICreateSpecification {
  name: string;
  description: string;
}

interface ISpecificationRepository {
  findByName(name: string): Specification;
  create(data: ICreateSpecification): void;
}

export default ISpecificationRepository;
