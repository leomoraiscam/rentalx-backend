import path from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidv4 } from 'uuid';

import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import IDateProvider from '@shared/container/providers/DateProvider/IDateProvider';
import IMailProvider from '@shared/container/providers/MailProvider/IMailProvider';
import AppError from '@shared/errors/AppError';

@injectable()
class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UserRepository')
    private usersRepository: IUserRepository,
    @inject('UsersTokensRepository')
    private usersTokensRepository: IUserTokenRepository,
    @inject('DayjsDateProvider')
    private dayjsDateProvider: IDateProvider,
    @inject('EtherealMailProvider')
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.usersRepository.findByEmail(email);

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgotPassword.hbs'
    );

    if (!user) {
      throw new AppError('User does not exist!');
    }

    const token = uuidv4();

    const expires_date = this.dayjsDateProvider.addHours(3);

    await this.usersTokensRepository.create({
      refresh_token: token,
      user_id: user.id,
      expires_date,
    });

    const variables = {
      name: user.name,
      link: `${process.env.FORGOT_MAIL_URL}${token}`,
    };

    await this.mailProvider.sendMail(
      email,
      'Recuperação de senha',
      variables,
      templatePath
    );
  }
}

export default SendForgotPasswordMailUseCase;
