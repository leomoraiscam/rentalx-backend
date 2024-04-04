import { InMemoryUserRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserRepository';
import { InMemoryUserTokenRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserTokenRepository';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { InMemoryHashProvider } from '@shared/container/providers/HashProvider/in-memory/InMemoryHashProvider';
import { AppError } from '@shared/errors/AppError';

import { ResetPasswordUseCase } from './ResetPasswordUseCase';

let inMemoryUserTokenRepository: InMemoryUserTokenRepository;
let inMemoryDateProvider: InMemoryDateProvider;
let inMemoryUserRepository: InMemoryUserRepository;
let inMemoryHashProvider: InMemoryHashProvider;
let resetPasswordUseCase: ResetPasswordUseCase;

describe('ResetPasswordUseCase', () => {
  beforeEach(() => {
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryHashProvider = new InMemoryHashProvider();
    resetPasswordUseCase = new ResetPasswordUseCase(
      inMemoryUserTokenRepository,
      inMemoryUserRepository,
      inMemoryDateProvider,
      inMemoryHashProvider
    );
  });

  it('should be able to reset password', async () => {
    const { id: userId } = await inMemoryUserRepository.create({
      name: 'Cody Carr',
      email: 'gawu@lutez.ch',
      password: '@anyPassword',
      driverLicense: '8074109646',
    });

    await inMemoryUserTokenRepository.create({
      expiresDate: new Date(),
      refreshToken: 'example-token',
      userId,
    });

    const generateHashSpied = jest.spyOn(inMemoryHashProvider, 'generateHash');

    await resetPasswordUseCase.execute({
      password: 'new-password@123',
      token: 'example-token',
    });

    const updatedUser = await inMemoryUserRepository.findById(userId);

    expect(generateHashSpied).toHaveBeenCalledWith('new-password@123');
    expect(updatedUser?.password).toBe('new-password@123');
  });

  it('should not be able to reset the password when token a non exist', async () => {
    await expect(
      resetPasswordUseCase.execute({
        token: 'non-existing-token',
        password: '12312345',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset the password when a non-exist user', async () => {
    await inMemoryUserTokenRepository.create({
      expiresDate: new Date(),
      refreshToken: 'example-token',
      userId: 'a-non-existing-user',
    });

    await expect(
      resetPasswordUseCase.execute({
        token: 'example-token',
        password: '12312345',
      })
    ).rejects.toBeInstanceOf(AppError);
  });

  it('should not be able to reset password if passed more than 3 hours', async () => {
    const { id: userId } = await inMemoryUserRepository.create({
      name: 'Bess Ferguson',
      email: 'gew@jitucas.kg',
      password: 'password@123',
      driverLicense: '3614503223',
    });

    const expiredDate = new Date();
    expiredDate.setHours(expiredDate.getHours() - 3);

    await inMemoryUserTokenRepository.create({
      expiresDate: expiredDate,
      refreshToken: 'expired-token',
      userId,
    });

    const currentDate = new Date();

    currentDate.setHours(currentDate.getHours() + 3);
    inMemoryDateProvider.setCurrentDate(currentDate);

    await expect(
      resetPasswordUseCase.execute({
        password: '123123',
        token: 'expired-token',
      })
    ).rejects.toBeInstanceOf(AppError);
  });
});
