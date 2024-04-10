import { ICreateSpecificationDTO } from '../dtos/ICreateSpecificationDTO';
import { IPaginationQueryResponseDTO } from '../dtos/IPaginationResponseDTO';
import { IQueryListCategoriesDTO } from '../dtos/IQueryListCategoriesDTO';
import { Specification } from '../infra/typeorm/entities/Specification';

export interface ISpecificationRepository {
  findByName(name: string): Promise<Specification | null>;
  findByIds(ids: string[]): Promise<Specification[] | null>;
  list(
    options?: IQueryListCategoriesDTO
  ): Promise<IPaginationQueryResponseDTO<Specification>>;
  create(data: ICreateSpecificationDTO): Promise<Specification>;
}
