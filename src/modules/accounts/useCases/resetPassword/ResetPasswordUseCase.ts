import { inject, injectable } from 'tsyringe';

import { IResetPasswordDTO } from '@modules/accounts/dtos/IResetPasswordDTO';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class ResetPasswordUseCase {
  constructor(
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('HashProvider')
    private hashProvider: IHashProvider
  ) {}

  async execute({ token, password }: IResetPasswordDTO): Promise<void> {
    const userToken = await this.userTokenRepository.findByRefreshToken(token);

    if (!userToken) {
      throw new AppError('token not found', 404);
    }

    const { id, userId, expiresDate } = userToken;

    const user = await this.userRepository.findById(userId);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    if (
      this.dateProvider.compareIfBefore(
        expiresDate,
        this.dateProvider.dateNow()
      )
    ) {
      throw new AppError('Invalid or expired token', 401);
    }

    const hashPassword = await this.hashProvider.generateHash(password);

    Object.assign(user, {
      password: hashPassword,
    });

    await Promise.all([
      this.userRepository.create(user),
      this.userTokenRepository.deleteById(id),
    ]);
  }
}
