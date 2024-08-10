import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { auth } from '@config/auth';
import { IRefreshedTokenDTO } from '@modules/accounts/dtos/IRefreshedTokenDTO';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';
import { AppError } from '@shared/errors/AppError';

interface IPayload {
  sub: string;
  email: string;
}

@injectable()
export class RefreshTokenUseCase {
  constructor(
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('LoggerProvider')
    private loggerProvider: ILoggerProvider
  ) {}

  async execute(token: string): Promise<IRefreshedTokenDTO> {
    const {
      secretRefreshToken,
      expiresInRefreshToken,
      expiresRefreshTokenDays,
    } = auth;
    const { email, sub: userId } = verify(
      token,
      secretRefreshToken
    ) as IPayload;
    const userToken = await this.userTokenRepository.findByUserIdAndRefreshToken(
      {
        userId,
        refreshToken: token,
      }
    );

    if (!userToken) {
      throw new AppError('Invalid or expired token', 401);
    }

    await this.userTokenRepository.deleteById(userToken.id);

    if (!secretRefreshToken || !expiresInRefreshToken) {
      this.loggerProvider.log({
        level: 'error',
        message: `${RefreshTokenUseCase.name} Missing environment variables for JWT configuration`,
        metadata: auth,
      });

      throw new AppError('Internal dependency is missing', 424);
    }

    const refreshToken = sign({ email }, secretRefreshToken, {
      subject: userId,
      expiresIn: expiresInRefreshToken,
    });
    const parsedExpiresRefreshTokenDays = Number(expiresRefreshTokenDays);
    const expiresDate = this.dateProvider.addDays(
      parsedExpiresRefreshTokenDays
    );

    await this.userTokenRepository.create({
      expiresDate,
      refreshToken,
      userId,
    });

    return {
      refreshToken,
    };
  }
}
