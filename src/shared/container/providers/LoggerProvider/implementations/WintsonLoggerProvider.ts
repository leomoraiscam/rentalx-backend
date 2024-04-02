import winston, { createLogger, Logger } from 'winston';

import { ICreateLoggerDTO } from '../dtos/ICreateLoggerDTO';
import { ILoggerProvider } from '../models/ILoggerProvider';

export class WinstonLoggerProvider implements ILoggerProvider {
  private logger: Logger;

  log({ level, message, metadata }: ICreateLoggerDTO): void {
    this.logger = createLogger({
      level,
      format: winston.format.json(),
    });

    this.logger.log(level, message, { metadata });
  }
}
