import { verify, sign } from 'jsonwebtoken';
import { inject, injectable } from 'tsyringe';

import { auth } from '@config/auth';
import { IRefreshedTokenDTO } from '@modules/accounts/dtos/IRefreshedTokenDTO';
import { TokenTypeEnum } from '@modules/accounts/enums/tokenTypeEnum';
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
        type: TokenTypeEnum.RefreshToken,
      }
    );

    if (!userToken) {
      throw new AppError('Invalid or expired token', 401);
    }

    await this.userTokenRepository.delete(userToken.id);

    if (
      !secretRefreshToken ||
      !expiresInRefreshToken ||
      !auth.secretToken ||
      !auth.expiresIn
    ) {
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

    const accessToken = sign({}, auth.secretToken, {
      subject: userId,
      expiresIn: auth.expiresIn,
    });

    const expiresDateLimitRefreshToken = this.dateProvider.addDays(
      Number(expiresRefreshTokenDays)
    );

    await this.userTokenRepository.create({
      expiresDate: expiresDateLimitRefreshToken,
      refreshToken,
      userId,
      type: TokenTypeEnum.RefreshToken,
    });

    return {
      refreshToken,
      token: accessToken,
    };
  }
}
