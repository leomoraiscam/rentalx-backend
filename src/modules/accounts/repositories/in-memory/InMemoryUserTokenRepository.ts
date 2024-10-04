import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IFindTokenByUserIdDTO } from '@modules/accounts/dtos/IFindTokenByUserIdDTO';
import { UserToken } from '@modules/accounts/infra/typeorm/entities/UserToken';

import { IUserTokenRepository } from '../IUserTokenRepository';

export class InMemoryUserTokenRepository implements IUserTokenRepository {
  private userTokens: UserToken[] = [];

  async findByUserIdAndRefreshToken(
    data: IFindTokenByUserIdDTO
  ): Promise<UserToken | null> {
    const { refreshToken, userId } = data;

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

  async findByUserId(userId: string): Promise<UserToken | null> {
    return this.userTokens.find((userToken) => userToken.userId === userId);
  }

  async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const { userId, refreshToken, expiresDate } = data;
    const userToken = new UserToken();

    Object.assign(userToken, {
      userId,
      refreshToken,
      expiresDate,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  async delete(id: string): Promise<void> {
    const userTokenIndex = this.userTokens.findIndex(
      (userToken) => userToken.id === id
    );

    Object.assign(this.userTokens[userTokenIndex], {
      deletedAt: new Date(),
    });
  }
}
