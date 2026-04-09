import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IFindTokenByUserIdDTO } from '@modules/accounts/dtos/IFindTokenByUserIdDTO';
import { TokenTypeEnum } from '@modules/accounts/enums/TokenTypeEnum';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';

import { UserToken } from '../entities/UserToken';

export class UserTokenRepository implements IUserTokenRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async findByUserIdAndRefreshToken(
    data: IFindTokenByUserIdDTO
  ): Promise<UserToken | null> {
    const { refreshToken, userId, type } = data;

    return this.repository.findOne({
      where: {
        refreshToken,
        userId,
        type,
        deletedAt: null,
      },
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<UserToken | null> {
    return this.repository.findOne({
      where: {
        refreshToken,
        deletedAt: null,
      },
    });
  }

  async findByUserId(
    userId: string,
    type: TokenTypeEnum
  ): Promise<UserToken | null> {
    return this.repository.findOne({
      where: {
        userId,
        deletedAt: null,
        type,
      },
    });
  }

  async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const { userId, refreshToken, expiresDate, type } = data;
    const userToken = this.repository.create({
      userId,
      refreshToken,
      expiresDate,
      type,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async delete(id: string): Promise<void> {
    await this.repository.delete(id);
  }

  async deleteByUserId(userId: string): Promise<void> {
    await this.repository.update({ userId }, { deletedAt: new Date() });
  }

  async deleteByUserIdAndToken(userId: string, token: string): Promise<void> {
    await this.repository.update(
      { userId, refreshToken: token },
      { deletedAt: new Date() }
    );
  }
}
