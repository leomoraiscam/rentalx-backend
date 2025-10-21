import { ISendMailDTO } from '../dtos/ISendMailDTO';
import { IMailProvider } from '../models/IMailProvider';

export class InMemoryMailProvider implements IMailProvider {
  private messages: ISendMailDTO<unknown>[] = [];

  public async sendMail<T>(data: ISendMailDTO<T>): Promise<void> {
    const { path, subject, to, variables } = data;

    this.messages.push({
      to,
      subject,
      variables,
      path,
    });
  }
}
