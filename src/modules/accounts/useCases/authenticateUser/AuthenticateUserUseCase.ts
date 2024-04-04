import { sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { auth } from '@config/auth';
import { IAuthenticatedUserDTO } from '@modules/accounts/dtos/IAuthenticatedUserDTO';
import { IAuthenticationUserDTO } from '@modules/accounts/dtos/IAuthenticationUserDTO';
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

  async execute({
    email,
    password,
  }: IAuthenticationUserDTO): Promise<IAuthenticatedUserDTO> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('Email or password incorrect', 401);
    }

    const passwordMatch = await this.hashProvider.compareHash(
      password,
      user.password
    );

    if (!passwordMatch) {
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

      return;
    }

    const { id: userId } = user;

    const token = sign({}, secretToken, {
      subject: userId,
      expiresIn,
    });

    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: userId,
      expiresIn: expiresInRefreshToken,
    });

    const parsedExpiresRefreshTokenDays = Number(expiresRefreshTokenDays);
    const refreshTokenExpiresDate = this.dateProvider.addDays(
      parsedExpiresRefreshTokenDays
    );

    await this.userTokenRepository.create({
      userId,
      refreshToken,
      expiresDate: refreshTokenExpiresDate,
    });

    return {
      token,
      user,
      refreshToken,
    };
  }
}
