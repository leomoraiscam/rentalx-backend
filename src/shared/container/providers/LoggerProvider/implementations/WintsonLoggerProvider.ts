import winston, { createLogger, Logger } from 'winston';

import { ICreateLoggerDTO } from '../dtos/ICreateLoggerDTO';
import { ILoggerProvider } from '../models/ILoggerProvider';

export class WinstonLoggerProvider implements ILoggerProvider {
  private logger: Logger;

  log(data: ICreateLoggerDTO): void {
    const { level, message, metadata } = data;

    this.logger = createLogger({
      level,
      format: winston.format.json(),
    });

    this.logger.log(level, message, { metadata });
  }
}
