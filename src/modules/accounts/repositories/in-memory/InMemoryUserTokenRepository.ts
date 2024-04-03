import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IFindTokensByUserIdDTO } from '@modules/accounts/dtos/IFindTokensByUserIdDTO';
import { UserToken } from '@modules/accounts/infra/typeorm/entities/UserToken';

import { IUserTokenRepository } from '../IUserTokenRepository';

export class InMemoryUserTokenRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = [];

  async findByUserIdAndRefreshToken({
    refreshToken,
    userId,
  }: IFindTokensByUserIdDTO): Promise<UserToken | null> {
    return this.userTokens.find(
      (userToken) =>
        userToken.userId === userId && userToken.refreshToken === refreshToken
    );
  }

  async findByRefreshToken(refreshToken: string): Promise<UserToken | null> {
    return this.userTokens.find(
      (userToken) => userToken.refreshToken === refreshToken
    );
  }

  async create({
    userId,
    refreshToken,
    expiresDate,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = new UserToken();

    Object.assign(userToken, {
      userId,
      refreshToken,
      expiresDate,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    const userToken = this.userTokens.find((userToken) => userToken.id === id);

    this.userTokens.splice(this.userTokens.indexOf(userToken));
  }
}
