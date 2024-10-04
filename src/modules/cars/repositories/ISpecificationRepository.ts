import { IPaginationQueryResponseDTO } from '@shared/common/dtos/IPaginationResponseDTO';
import { IQueryListOptionsDTO } from '@shared/common/dtos/IQueryListOptionsDTO';

import { ICreateSpecificationDTO } from '../dtos/ICreateSpecificationDTO';
import { Specification } from '../infra/typeorm/entities/Specification';

export interface ISpecificationRepository {
  findByName(name: string): Promise<Specification | null>;
  findByIds(ids: string[]): Promise<Specification[] | null>;
  list(
    options?: IQueryListOptionsDTO
  ): Promise<IPaginationQueryResponseDTO<Specification>>;
  create(data: ICreateSpecificationDTO): Promise<Specification>;
}
