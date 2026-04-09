import { IMailProvider } from '../models/IMailProvider';
import { ISendMailDTO } from '../dtos/ISendMailDTO';

/**
 * Fake Mail Provider para uso em testes.
 * Não abre conexões externas TCP, apenas armazena os emails enviados em memória.
 */
export class InMemoryMailProvider implements IMailProvider {
  public sentMails: ISendMailDTO<unknown>[] = [];

  async sendMail<T>(data: ISendMailDTO<T>): Promise<void> {
    this.sentMails.push(data as ISendMailDTO<unknown>);
  }
}
