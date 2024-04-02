import { getRepository, Repository } from 'typeorm';

import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';

import ICreateUserTokenDTO from '../../../dtos/ICreateUserTokenDTO';
import { UserToken } from '../entities/UserToken';

export class UserTokenRepository implements IUserTokenRepository {
  private repository: Repository<UserToken>;

  constructor() {
    this.repository = getRepository(UserToken);
  }

  async findByUserIdAndRefreshToken(
    user_id: string,
    refresh_token: string
  ): Promise<UserToken | null> {
    return this.repository.findOne({
      user_id,
      refresh_token,
    });
  }

  async findByRefreshToken(refresh_token: string): Promise<UserToken | null> {
    return this.repository.findOne({
      refresh_token,
    });
  }

  async create({
    user_id,
    refresh_token,
    expires_date,
  }: ICreateUserTokenDTO): Promise<UserToken> {
    const userToken = this.repository.create({
      user_id,
      refresh_token,
      expires_date,
    });

    await this.repository.save(userToken);

    return userToken;
  }

  async deleteById(id: string): Promise<void> {
    await this.repository.delete(id);
  }
}
