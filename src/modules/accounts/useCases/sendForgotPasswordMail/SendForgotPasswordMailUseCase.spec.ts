import { InMemoryUserRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserRepository';
import { InMemoryUserTokenRepository } from '@modules/accounts/repositories/in-memory/InMemoryUserTokenRepository';
import { InMemoryDateProvider } from '@shared/container/providers/DateProvider/in-memory/InMemoryDateProvider';
import { InMemoryMailProvider } from '@shared/container/providers/MailProvider/in-memory/InMemoryMailProvider';
import { AppError } from '@shared/errors/AppError';

import { SendForgotPasswordMailUseCase } from './SendForgotPasswordMailUseCase';

describe('SendForgotPasswordMailUseCase', () => {
  let inMemoryUserRepository: InMemoryUserRepository;
  let inMemoryUserTokenRepository: InMemoryUserTokenRepository;
  let inMemoryDateProvider: InMemoryDateProvider;
  let inMemoryMailProvider: InMemoryMailProvider;
  let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
  let sendMailSpied: unknown;

  beforeEach(() => {
    inMemoryUserRepository = new InMemoryUserRepository();
    inMemoryUserTokenRepository = new InMemoryUserTokenRepository();
    inMemoryDateProvider = new InMemoryDateProvider();
    inMemoryMailProvider = new InMemoryMailProvider();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      inMemoryUserRepository,
      inMemoryUserTokenRepository,
      inMemoryDateProvider,
      inMemoryMailProvider
    );
    sendMailSpied = jest.spyOn(inMemoryMailProvider, 'sendMail') as jest.Mock;
  });

  it('should be able to send recover the password when received correct data', async () => {
    const { email } = await inMemoryUserRepository.create({
      name: 'Todd Fisher',
      email: 'ogimcak@zad.fj',
      password: 'any-pass@123',
      driverLicense: '8276259318',
    });

    await sendForgotPasswordMailUseCase.execute(email);

    expect(sendMailSpied).toHaveBeenCalled();
    expect(sendMailSpied).toHaveBeenCalledTimes(1);
  });

  it('should not be able to recover the password when user a non-exist', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('any-mail@email.com')
    ).rejects.toBeInstanceOf(AppError);

    expect(sendMailSpied).not.toHaveBeenCalled();
    expect(sendMailSpied).toHaveBeenCalledTimes(0);
  });
});
