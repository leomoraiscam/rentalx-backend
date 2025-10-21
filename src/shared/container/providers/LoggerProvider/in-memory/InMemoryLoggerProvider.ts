import { ICreateLoggerDTO } from '../dtos/ICreateLoggerDTO';
import { ILoggerProvider } from '../models/ILoggerProvider';

export class InMemoryLoggerProvider implements ILoggerProvider {
  log(_: ICreateLoggerDTO): void {}
}
