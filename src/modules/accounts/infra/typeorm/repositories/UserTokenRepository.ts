import { getRepository, Repository } from 'typeorm';

import { ICreateUserTokenDTO } from '@modules/accounts/dtos/ICreateUserTokenDTO';
import { IFindTokensByUserIdDTO } from '@modules/accounts/dtos/IFindTokensByUserIdDTO';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';

import { UserToken } from '../entities/UserToken';

export class UserTokenRepository implements IUserTokenRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async findByUserIdAndRefreshToken(
    data: IFindTokensByUserIdDTO
  ): Promise<UserToken | null> {
    const { refreshToken, userId } = data;

    return this.repository.findOne({
      refreshToken,
      userId,
    });
  }

  async findByRefreshToken(refreshToken: string): Promise<UserToken | null> {
    return this.repository.findOne({
      refreshToken,
    });
  }

  async create(data: ICreateUserTokenDTO): Promise<UserToken> {
    const { userId, refreshToken, expiresDate } = data;
    const userToken = this.repository.create({
      userId,
      refreshToken,
      expiresDate,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
