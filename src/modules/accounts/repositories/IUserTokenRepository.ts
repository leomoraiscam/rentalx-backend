import { ICreateUserTokenDTO } from '../dtos/ICreateUserTokenDTO';
import { IFindTokenByUserIdDTO } from '../dtos/IFindTokenByUserIdDTO';
import { TokenTypeEnum } from '../enums/tokenTypeEnum';
import { UserToken } from '../infra/typeorm/entities/UserToken';

export interface IUserTokenRepository {
  findByUserIdAndRefreshToken(
    data: IFindTokenByUserIdDTO
  ): Promise<UserToken | null>;
  findByRefreshToken(
    refreshToken: string,
    type: TokenTypeEnum
  ): Promise<UserToken | null>;
  findByUserId(userId: string, type: TokenTypeEnum): Promise<UserToken | null>;
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
  delete(id: string): Promise<void>;
  deleteByUserId(userId: string): Promise<void>;
  deleteByUserIdAndToken(userId: string, token: string): Promise<void>;
}
