import { ISendMailDTO } from '../dtos/ISendMailDTO';

export interface IMailProvider {
  sendMail<T>(data: ISendMailDTO<T>): Promise<void>;
}
