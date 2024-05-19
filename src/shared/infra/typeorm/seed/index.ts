/* eslint-disable import/order */
/* eslint-disable import-helpers/order-imports */
/* eslint-disable no-useless-catch */
import 'reflect-metadata';
import createConnection from '..';
import { USER, CATEGORIES, SPECIFICATIONS } from './data';
import '@shared/container';
import { makeCreateUserHandler } from './factories/CreateUserHandlerFactory';
import { makeCreateCategoriesHandler } from './factories/CreateCategoriesHandlerFactory';
import { makeCreateSpecificationsHandler } from './factories/CreateSpecificationsHandlerFactory';

import { adaptSeederHandler } from './adapters/SeederHandleAdapter';
import { ILoggerProvider } from '@shared/container/providers/LoggerProvider/models/ILoggerProvider';
import { WinstonLoggerProvider } from '@shared/container/providers/LoggerProvider/implementations/WintsonLoggerProvider';

const user = async (loggerService: ILoggerProvider) => {
  try {
    const createUserHandler = adaptSeederHandler(makeCreateUserHandler());

    await createUserHandler(USER);

    loggerService.log({
      level: 'log',
      message: 'Successfully completed seeding user',
    });
  } catch (err) {
    loggerService.log({
      level: 'log',
      message: 'Failed seeding user',
      metadata: err,
    });

    return 0;
  }
};

const categories = async (loggerService: ILoggerProvider) => {
  try {
    const createCategoriesHandler = adaptSeederHandler(
      makeCreateCategoriesHandler()
    );

    await createCategoriesHandler(CATEGORIES);

    loggerService.log({
      level: 'log',
      message: 'Successfully completed seeding categories',
    });
  } catch (err) {
    loggerService.log({
      level: 'log',
      message: 'Failed seeding categories',
      metadata: err,
    });

    return 0;
  }
};

const specifications = async (loggerService: ILoggerProvider) => {
  try {
    const createSpecificationsHandler = adaptSeederHandler(
      makeCreateSpecificationsHandler()
    );

    await createSpecificationsHandler(SPECIFICATIONS);

    loggerService.log({
      level: 'log',
      message: 'Successfully completed seeding specifications',
    });
  } catch (err) {
    loggerService.log({
      level: 'log',
      message: 'Failed seeding specifications',
      metadata: err,
    });

    return 0;
  }
};

async function main(loggerService: ILoggerProvider) {
  await createConnection();

  await Promise.all([
    user(loggerService),
    categories(loggerService),
    specifications(loggerService),
  ]);
}

const loggerProvider = new WinstonLoggerProvider();

main(loggerProvider);
