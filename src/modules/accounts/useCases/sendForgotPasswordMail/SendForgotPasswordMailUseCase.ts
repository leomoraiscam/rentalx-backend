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
  private readonly TOKEN_EXPIRATION_HOURS = 3;

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

    const token = uuidV4();
    const { id: userId, name } = user;
    const expiresDateLimitToken = this.dateProvider.addHours(
      this.TOKEN_EXPIRATION_HOURS
    );

    await this.userTokenRepository.create({
      refreshToken: token,
      userId,
      expiresDate: expiresDateLimitToken,
    });

    const templatePath = path.resolve(
      __dirname,
      '..',
      '..',
      'views',
      'emails',
      'forgotPassword.hbs'
    );
    const resetPasswordUrl =
      process.env.APP_URL && process.env.APP_PORT
        ? `${process.env.APP_URL}:${process.env.APP_PORT}/password/reset?token=${token}`
        : `http://localhost:3333/password/reset?token=${token}`;
    const variables = {
      name,
      resetPasswordUrl,
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
