import { ISendMailDTO } from '../dtos/ISendMailDTO';

export interface IMailProvider {
  sendMail<T>({ path, subject, to, variables }: ISendMailDTO<T>): Promise<void>;
}
