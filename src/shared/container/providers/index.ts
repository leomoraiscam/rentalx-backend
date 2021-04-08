import { container } from 'tsyringe';

import IDateProvider from './DateProvider/IDateProvider';
import DatejsDateProvider from './DateProvider/implementations/DayjsDateProvider';
import IMailProvider from './MailProvider/IMailProvider';
import EtherealMailProvider from './MailProvider/implementations/EtherealMailProvider';

container.registerSingleton<IDateProvider>(
  'DayjsDateProvider',
  DatejsDateProvider
);

container.registerInstance<IMailProvider>(
  'EtherealMailProvider',
  new EtherealMailProvider()
);
