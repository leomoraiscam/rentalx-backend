import ICreateUserTokenDTO from '../../dtos/ICreateUserTokenDTO';
import { UserToken } from '../../infra/typeorm/entities/UserToken';
import { IUserTokenRepository } from '../IUserTokenRepository';

export class InMemoryUserTokenRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = [];

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken | null> {
    return this.userTokens.find(
      (userToken) =>
        userToken.user_id === user_id &&
        userToken.refresh_token === refresh_token
    );
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken | null> {
    return this.userTokens.find(
      (userToken) => userToken.refresh_token === refresh_token
    );
  }

  async create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      user_id,
      refresh_token,
      expires_date,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.userTokens.find((userToken) => userToken.id === id);

    this.userTokens.splice(this.userTokens.indexOf(userToken));
  }
}
