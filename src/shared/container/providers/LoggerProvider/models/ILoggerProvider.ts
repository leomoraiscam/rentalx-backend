import { ICreateLoggerDTO } from '../dtos/ICreateLoggerDTO';

export interface ILoggerProvider {
  log(data: ICreateLoggerDTO): void;
}
