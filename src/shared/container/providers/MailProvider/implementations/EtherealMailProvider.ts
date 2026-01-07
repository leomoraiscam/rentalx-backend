import nodemailer, { Transporter } from 'nodemailer';
import { inject, injectable } from 'tsyringe';

import { ILoggerProvider } from '../../LoggerProvider/models/ILoggerProvider';
import { IMailTemplateVariablesDTO } from '../../MailTemplateProvider/dtos/IParseMailTemplateDTO';
import { IMailTemplateProvider } from '../../MailTemplateProvider/models/IMailTemplateProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

@injectable()
export class EtherealMailProvider implements IMailProvider {
  private client: Transporter;

  constructor(
    @inject('MailTemplateProvider')
    private mailTemplateProvider: IMailTemplateProvider,
    @inject('LoggerProvider')
    private loggerProvider: ILoggerProvider
  ) {
    nodemailer
      .createTestAccount()
      .then((account) => {
        const transporter = nodemailer.createTransport({
          host: account.smtp.host,
          port: account.smtp.port,
          secure: account.smtp.secure,
          auth: {
            user: account.user,
            pass: account.pass,
          },
        });

        this.client = transporter;
      })
      .catch((error) => {
        this.loggerProvider.log({
          level: 'error',
          message: 'Occurs an error in setup nodemailer',
          metadata: {
            message: error?.message,
          },
        });
      });
  }

  async sendMail<T extends IMailTemplateVariablesDTO>(
    data: ISendMailDTO<T>
  ): Promise<void> {
    const { path, subject, to, variables } = data;
    const mailTemplate = await this.mailTemplateProvider.parse({
      file: path,
      variables,
    });

    const message = await this.client.sendMail({
      to,
      from: 'RentalX <noreply@rentx.com.br>',
      subject,
      html: mailTemplate,
    });

    this.loggerProvider.log({
      level: 'info',
      message: 'Email message sent',
      metadata: {
        id: message.messageId,
        previewUrl: nodemailer.getTestMessageUrl(message),
      },
    });
  }
}
