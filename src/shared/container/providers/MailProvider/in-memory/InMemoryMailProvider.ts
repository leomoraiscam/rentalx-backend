import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

export class InMemoryMailProvider implements IMailProvider {
  private messages: ISendMailDTO<unknown>[] = [];

  public async sendMail<T>({
    path,
    subject,
    to,
    variables,
  }: ISendMailDTO<T>): Promise<void> {
    this.messages.push({
      to,
      subject,
      variables,
      path,
    });
  }
}
