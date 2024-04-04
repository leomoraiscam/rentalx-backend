import { ICreateSpecificationDTO } from '../dtos/ICreateSpecificationDTO';
import { Specification } from '../infra/typeorm/entities/Specification';

export interface ISpecificationRepository {
  findByName(name: string): Promise<Specification | null>;
  findByIds(ids: string[]): Promise<Specification[] | null>;
  create(data: ICreateSpecificationDTO): Promise<Specification>;
}
