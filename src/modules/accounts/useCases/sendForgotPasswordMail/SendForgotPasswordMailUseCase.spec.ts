import UserRepositoryInMemory from '@modules/accounts/repositories/in-memory/UsersRepositoryInMemory';
import UsersTokensRepositoryInMemory from '@modules/accounts/repositories/in-memory/UsersTokensRepositoryInMemory';
import EmailRepositoryInMemory from '@modules/emails/repositories/in-memory/EmailRepositoryInMemory';
import DayjsDateProvider from '@shared/container/providers/DateProvider/implementations/DayjsDateProvider';
import MailProviderInMemory from '@shared/container/providers/MailProvider/in-memory/MailProviderInMemory';
import AppError from '@shared/errors/AppError';

import SendForgotPasswordMailUseCase from './SendForgotPasswordMailUseCase';

let sendForgotPasswordMailUseCase: SendForgotPasswordMailUseCase;
let userRepositoryInMemory: UserRepositoryInMemory;
let usersTokensRepositoryInMemory: UsersTokensRepositoryInMemory;
let dayjsDateProvider: DayjsDateProvider;
let mailProviderInMemory: MailProviderInMemory;
let emailRepositoryInMemory: EmailRepositoryInMemory;

describe('Send forgot mail', () => {
  beforeEach(() => {
    userRepositoryInMemory = new UserRepositoryInMemory();
    usersTokensRepositoryInMemory = new UsersTokensRepositoryInMemory();
    dayjsDateProvider = new DayjsDateProvider();
    mailProviderInMemory = new MailProviderInMemory();
    emailRepositoryInMemory = new EmailRepositoryInMemory();
    sendForgotPasswordMailUseCase = new SendForgotPasswordMailUseCase(
      userRepositoryInMemory,
      usersTokensRepositoryInMemory,
      dayjsDateProvider,
      mailProviderInMemory,
      emailRepositoryInMemory
    );
  });

  it('should be able to send a forgot password mail to user', async () => {
    const sendMail = spyOn(mailProviderInMemory, 'sendMail');

    await userRepositoryInMemory.create({
      driver_license: '424-6812',
      email: 'sinaasi@bo.hu',
      name: 'Georgia Manning',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('sinaasi@bo.hu');

    expect(sendMail).toHaveBeenCalled();
  });

  it('should not be able to send a mail if user does not exist', async () => {
    await expect(
      sendForgotPasswordMailUseCase.execute('ha@mal.gp')
    ).rejects.toEqual(new AppError('User does not exist!'));
  });

  it('should be able to create an users tokens', async () => {
    const generateTokenMail = spyOn(usersTokensRepositoryInMemory, 'create');

    await userRepositoryInMemory.create({
      driver_license: '481-6813',
      email: 'le@adoom.sl',
      name: 'Wesley Walters',
      password: '1234',
    });

    await sendForgotPasswordMailUseCase.execute('le@adoom.sl');

    expect(generateTokenMail).toHaveBeenCalled();
  });
});
