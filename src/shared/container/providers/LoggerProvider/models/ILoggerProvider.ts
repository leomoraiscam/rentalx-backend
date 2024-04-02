import { ICreateLoggerDTO } from '../dtos/ICreateLoggerDTO';

export interface ILoggerProvider {
  log({ level, message, metadata }: ICreateLoggerDTO): void;
}
