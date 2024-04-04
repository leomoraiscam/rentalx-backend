import * as dotenv from 'dotenv';
import { container } from 'tsyringe';

import IDateProvider from './DateProvider/IDateProvider';
import DatejsDateProvider from './DateProvider/implementations/DayjsDateProvider';
import { BCryptHashProvider } from './HashProvider/implementations/BCryptHashProvider';
import { IHashProvider } from './HashProvider/models/IHashProvider';
import { WinstonLoggerProvider } from './LoggerProvider/implementations/WintsonLoggerProvider';
import { ILoggerProvider } from './LoggerProvider/models/ILoggerProvider';
import { IMailProvider } from './MailProvider/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';
import LocalStorageProvider from './StorageProvider/implementations/LocalStorageProvider';
import S3StorageProvider from './StorageProvider/implementations/S3StorageProvider';
import IStorageProvider from './StorageProvider/IStorageProvider';

dotenv.config();

container.registerSingleton<IDateProvider>(
  'DayjsDateProvider',
  DatejsDateProvider
);

container.registerInstance<IMailProvider>(
  'EtherealMailProvider',
  new EtherealMailProvider()
);

const diskStorage = {
  local: LocalStorageProvider,
  s3: S3StorageProvider,
};

container.registerSingleton<IStorageProvider>(
  'StorageProvider',
  diskStorage[process.env.DISK]
);

container.registerSingleton<ILoggerProvider>(
  'LoggerProvider',
  WinstonLoggerProvider
);
