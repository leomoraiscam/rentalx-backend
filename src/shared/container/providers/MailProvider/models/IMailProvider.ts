import { IMailTemplateVariablesDTO } from '../../MailTemplateProvider/dtos/IParseMailTemplateDTO';
import { ISendMailDTO } from '../dtos/ISendMailDTO';

export interface IMailProvider {
  sendMail<T extends IMailTemplateVariablesDTO>(
    data: ISendMailDTO<T>
  ): Promise<void>;
}
