import jwt from 'jsonwebtoken';

import { auth } from '@config/auth';
import { InMemoryUserRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserRepository';
import { InMemoryUserTokenRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserTokenRepository';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { InMemoryLoggerProvider } from '@shared/container/providers/LoggerProvider/in-memory/InMemoryLoggerProvider';
import { AppError } from '@shared/errors/AppError';

import { RefreshTokenUseCase } from './RefreshTokenUseCase';

jest.mock('jsonwebtoken');

describe('ResetPasswordUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryUserTokenRepository: InMemoryUserTokenRepository;
  let inMemoryDateProvider: InMemoryDateProvider;
  let inMemoryLoggerProvider: InMemoryLoggerProvider;
  let refreshTokenUseCase: RefreshTokenUseCase;
  let userId: string;

  beforeEach(async () => {
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryLoggerProvider = new InMemoryLoggerProvider();
    refreshTokenUseCase = new RefreshTokenUseCase(
      inMemoryUserTokenRepository,
      inMemoryDateProvider,
      inMemoryLoggerProvider
    );
    const { id } = await inMemoryUserRepository.create({
      name: 'Cody Carr',
      email: 'gawu@lutez.ch',
      password: '@anyPassword',
      driverLicense: '8074109646',
    });
    userId = id;
    await inMemoryUserTokenRepository.create({
      expiresDate: new Date(),
      refreshToken: 'example-token',
      userId,
    });
  });

  it('should be able to generate a new refreshToken when received correct data', async () => {
    (jwt.verify as jest.Mock).mockReturnValue({
      email: 'example@example.com',
      sub: userId,
    });

    const result = await refreshTokenUseCase.execute('example-token');

    expect(result).toHaveProperty('refreshToken');
  });

  it('should not be able to generate a new refreshToken when user token a non-exist', async () => {
    expect(refreshTokenUseCase.execute('example-token')).rejects.toBeInstanceOf(
      AppError
    );
  });

  it('should be able to logging an error when JWT configuration variables are missing', async () => {
    const loggerSpied = jest.spyOn(inMemoryLoggerProvider, 'log');
    auth.expiresInRefreshToken = '';

    (jwt.verify as jest.Mock).mockReturnValue({
      email: 'example@example.com',
      sub: userId,
    });

    await expect(
      refreshTokenUseCase.execute('example-token')
    ).rejects.toBeInstanceOf(AppError);
    expect(loggerSpied).toHaveBeenCalledTimes(1);
    expect(loggerSpied).toHaveBeenCalledWith({
      level: 'error',
      message:
        'RefreshTokenUseCase Missing environment variables for JWT configuration',
      metadata: expect.objectContaining({
        expiresIn: expect.any(String),
        expiresInRefreshToken: expect.any(String),
        expiresRefreshTokenDays: expect.any(String),
        secretRefreshToken: expect.any(String),
        secretToken: expect.any(String),
      }),
    });
  });
});
