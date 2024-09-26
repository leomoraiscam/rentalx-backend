import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { IFindTokenByUserIdDTO } from '../dtos/IFindTokenByUserIdDTO';
import { UserToken } from '../infra/typeorm/entities/UserToken';

export interface IUserTokenRepository {
  findByUserIdAndRefreshToken(
    data: IFindTokenByUserIdDTO
  ): Promise<UserToken | null>;
  findByRefreshToken(refreshToken: string): Promise<UserToken | null>;
  findByUserId(userId: string): Promise<UserToken | null>;
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
  delete(id: string): Promise<void>;
}
