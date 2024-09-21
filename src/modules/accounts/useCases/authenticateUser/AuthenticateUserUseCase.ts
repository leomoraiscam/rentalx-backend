import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { auth } from '@config/auth';
import { IAuthenticatedUserDTO } from '@modules/accounts/dtos/IAuthenticatedUserDTO';
import { IAuthenticateUserDTO } from '@modules/accounts/dtos/IAuthenticateUserDTO';
import { User } from '@modules/accounts/infra/typeorm/entities/User';
import { UserMap } from '@modules/accounts/mapper/UserMap';
import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { IHashProvider } from '@shared/container/providers/HashProvider/models/IHashProvider';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class AuthenticateUserUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('HashProvider')
    private hashProvider: IHashProvider,
    @inject('LoggerProvider')
    private loggerProvider: ILoggerProvider
  ) {}

  async execute(data: IAuthenticateUserDTO): Promise<IAuthenticatedUserDTO> {
    const { email, password } = data;
    const existingUser = await this.userRepository.findByEmail(email);

    if (!existingUser) {
      throw new AppError('Email or password incorrect', 401);
    }

    const matchPassword = await this.hashProvider.compareHash(
      password,
      existingUser.password
    );

    if (!matchPassword) {
      throw new AppError('Email or password incorrect', 401);
    }

    const {
      secretToken,
      expiresIn,
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = auth;

    if (!secretToken || !expiresIn) {
      this.loggerProvider.log({
        level: 'error',
        message: `${AuthenticateUserUseCase.name}: Missing environment variables for JWT configuration`,
        metadata: auth,
      });

      throw new AppError('Internal dependency is missing', 424);
    }

    const { id: userId } = existingUser;
    const token = sign({}, secretToken, {
      subject: userId,
      expiresIn,
    });
    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: userId,
      expiresIn: expiresInRefreshToken,
    });
    const expiresDateLimitRefreshToken = this.dateProvider.addDays(
      Number(expiresRefreshTokenDays)
    );

    await this.userTokenRepository.create({
      userId,
      refreshToken,
      expiresDate: expiresDateLimitRefreshToken,
    });

    const user = UserMap.toDTO(existingUser) as User;

    return {
      token,
      user,
      refreshToken,
    };
  }
}
