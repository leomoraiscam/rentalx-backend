import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IFindTokenByUserIdDTO } from '@modules/accounts/dtos/IFindTokenByUserIdDTO';
import { TokenTypeEnum } from '@modules/accounts/enums/tokenTypeEnum';
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

  async findByRefreshToken(
    refreshToken: string,
    type: TokenTypeEnum
  ): Promise<UserToken | null> {
    return this.userTokens.find(
      (userToken) =>
        userToken.refreshToken === refreshToken && userToken.type === type
    );
  }

  async findByUserId(userId: string): Promise<UserToken | null> {
    return this.userTokens.find((userToken) => userToken.userId === userId);
  }

  async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const { userId, refreshToken, expiresDate, type } = data;
    const userToken = new UserToken();

    Object.assign(userToken, {
      userId,
      refreshToken,
      expiresDate,
      type,
    });

    this.userTokens.push(userToken);

    return userToken;
  }

  async delete(id: string): Promise<void> {
    const userTokenIndex = this.userTokens.findIndex(
      (userToken) => userToken.id === id
    );
    const userTokenToDeleted = this.userTokens[userTokenIndex];

    Object.assign(userTokenToDeleted, {
      deletedAt: new Date(),
    });
  }

  async deleteByUserId(userId: string): Promise<void> {
    const userTokenIndex = this.userTokens.findIndex(
      (userToken) => userToken.userId === userId
    );
    const userTokenToDeleted = this.userTokens[userTokenIndex];

    Object.assign(userTokenToDeleted, {
      deletedAt: new Date(),
    });
  }

  async deleteByUserIdAndToken(userId: string, token: string): Promise<void> {
    const userTokenIndex = this.userTokens.findIndex(
      (userToken) =>
        userToken.userId === userId && userToken.refreshToken === token
    );
    const userTokenToDeleted = this.userTokens[userTokenIndex];

    Object.assign(userTokenToDeleted, {
      deletedAt: new Date(),
    });
  }
}
