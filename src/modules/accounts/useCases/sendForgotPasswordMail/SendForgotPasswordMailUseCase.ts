import path from 'path';
import { inject, injectable } from 'tsyringe';
import { v4 as uuidV4 } from 'uuid';

import { IUserRepository } from '@modules/accounts/repositories/IUserRepository';
import { IUserTokenRepository } from '@modules/accounts/repositories/IUserTokenRepository';
import { IDateProvider } from '@shared/container/providers/DateProvider/models/IDateProvider';
import { IMailProvider } from '@shared/container/providers/MailProvider/models/IMailProvider';
import { AppError } from '@shared/errors/AppError';

@injectable()
export class SendForgotPasswordMailUseCase {
  constructor(
    @inject('UserRepository')
    private userRepository: IUserRepository,
    @inject('UserTokenRepository')
    private userTokenRepository: IUserTokenRepository,
    @inject('DateProvider')
    private dateProvider: IDateProvider,
    @inject('MailProvider')
    private mailProvider: IMailProvider
  ) {}

  async execute(email: string): Promise<void> {
    const user = await this.userRepository.findByEmail(email);

    if (!user) {
      throw new AppError('User not found', 404);
    }

    const { id: userId, name } = user;
    const token = uuidV4();
    const expiresDate = this.dateProvider.addHours(3);

    await this.userTokenRepository.create({
      refreshToken: token,
      userId,
      expiresDate,
    });

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgotPassword.hbs'
    );
    const variables = {
      name,
      resetPasswordUrl: `${
        process.env.FORGOT_MAIL_URL || 'http://localhost:3333'
      }/password/reset?token=${token}`,
    };

    await this.mailProvider.sendMail<{
      name: string;
      resetPasswordUrl: string;
    }>({
      path: templatePath,
      subject: 'Recuperação de senha',
      to: email,
      variables,
    });
  }
}
