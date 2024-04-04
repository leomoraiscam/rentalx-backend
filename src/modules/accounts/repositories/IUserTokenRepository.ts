import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { IFindTokensByUserIdDTO } from '../dtos/IFindTokensByUserIdDTO';
import { UserToken } from '../infra/typeorm/entities/UserToken';

export interface IUserTokenRepository {
  findByUserIdAndRefreshToken(
    data: IFindTokensByUserIdDTO
  ): Promise<UserToken | null>;
  findByRefreshToken(refreshToken: string): Promise<UserToken | null>;
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
  deleteById(id: string): Promise<void>;
}
