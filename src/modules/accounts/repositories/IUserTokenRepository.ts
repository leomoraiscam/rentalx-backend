import ICreateUserTokenDTO from '../dtos/ICreateUserTokenDTO';
import { UserToken } from '../infra/typeorm/entities/UserToken';

export interface IUserTokenRepository {
  findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken | null>;
  findByRefreshToken(refresh_token: string): Promise<UserToken | null>;
  create(data: ICreateUserTokenDTO): Promise<UserToken>;
  deleteById(id: string): Promise<void>;
}
