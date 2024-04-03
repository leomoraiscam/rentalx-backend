import { auth } from '@config/auth';
import { InMemoryUserRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserRepository';
import { InMemoryUserTokenRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserTokenRepository';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { InMemoryHashProvider } from '@shared/container/providers/HashProvider/in-memory/InMemoryHashProvider';
import { InMemoryLoggerProvider } from '@shared/container/providers/LoggerProvider/in-memory/InMemoryLoggerProvider';
import AppError from '@shared/errors/AppError';

import { AuthenticateUserUseCase } from './AuthenticateUserUseCase';

let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryUserTokenRepository: InMemoryUserTokenRepository;
let inMemoryDateProvider: InMemoryDateProvider;
let inMemoryHashProvider: InMemoryHashProvider;
let inMemoryLoggerProvider: InMemoryLoggerProvider;
let authenticateUserUseCase: AuthenticateUserUseCase;

describe('AuthenticateUserUseCase', () => {
  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    inMemoryHashProvider = new InMemoryHashProvider();
    inMemoryLoggerProvider = new InMemoryLoggerProvider();
    authenticateUserUseCase = new AuthenticateUserUseCase(
      inMemoryUserRepository,
      inMemoryUserTokenRepository,
      inMemoryDateProvider,
      inMemoryHashProvider,
      inMemoryLoggerProvider
    );
  });

  it('should be able to return token and refreshToken property to user when the same is authenticate with success', async () => {
    await inMemoryUserRepository.create({
      name: 'Dollie Briggs',
      email: 'lez@cujve.vu',
      password: 'pass@123',
      driverLicense: '8587317685',
    });

    const response = await authenticateUserUseCase.execute({
      email: 'lez@cujve.vu',
      password: 'pass@123',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
  });

  it.skip('should be able to added deletedAt flag when the user has valid token bus make a new authenticate with success', async () => {
    jest.spyOn(Date, 'now').mockImplementationOnce(() => {
      return new Date(2024, 2, 27).getTime();
    });

    const { id: userId } = await inMemoryUserRepository.create({
      name: 'Sophia Bowers',
      email: 'nus@ju.mx',
      password: 'pass@123',
      driverLicense: '8587317685',
    });

    const refreshToken = await inMemoryUserTokenRepository.create({
      userId,
      expiresDate: new Date(2024, 2, 28),
      refreshToken: 'refresh-token-1',
    });

    const response = await authenticateUserUseCase.execute({
      email: 'nus@ju.mx',
      password: 'pass@123',
    });

    expect(response).toHaveProperty('token');
    expect(response).toHaveProperty('refreshToken');
    expect(refreshToken).toHaveProperty('deletedAt');
  });

  it('should not be able to return token property when user a non-exist', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'not-exist@email.com',
        password: 'pass@123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to return token property to user when received incorrect email for existing user', async () => {
    await inMemoryUserRepository.create({
      name: 'Jerry Gutierrez',
      email: 'zowmug@zuk.gt',
      password: 'pass@123',
      driverLicense: '3123798406',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'wrong-email@email.com',
        password: 'pass@123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to return token property to user when no email is provided', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: '',
        password: 'pass@123',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to return token property to user when received incorrect password for existing user', async () => {
    await inMemoryUserRepository.create({
      name: 'Richard Patterson',
      email: 'unu@uwa.tw',
      password: 'any-pass@1234',
      driverLicense: '9046996244',
    });

    await expect(
      authenticateUserUseCase.execute({
        email: 'unu@uwa.tw',
        password: 'wrong-pass',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to return token property to user when no password is provided', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: 'fake-email@email.com',
        password: '',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to return token property to user when no email and password are provided', async () => {
    await expect(
      authenticateUserUseCase.execute({
        email: '',
        password: '',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should be able to logging an error if JWT configuration variables are missing', async () => {
    const loggerSpied = jest.spyOn(inMemoryLoggerProvider, 'log');

    auth.secretToken = '';

    await inMemoryUserRepository.create({
      name: 'Dollie Briggs',
      email: 'lez@cujve.vu',
      password: 'any-pass@123',
      driverLicense: '8587317685',
    });

    await authenticateUserUseCase.execute({
      email: 'lez@cujve.vu',
      password: 'any-pass@123',
    });

    expect(loggerSpied).toHaveBeenCalledTimes(1);
    expect(loggerSpied).toHaveBeenCalledWith({
      level: 'error',
      message:
        'AuthenticateUserUseCase: Missing environment variables for JWT configuration',
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
