import { Connection, createConnection, getConnectionOptions } from 'typeorm';

export default async (host = process.env.PG_HOST): Promise<Connection> => {
  const defaultOptions = await getConnectionOptions();

  return createConnection(
    Object.assign(defaultOptions, {
      host: process.env.NODE_ENV === 'test' ? process.env.PG_HOST_TEST : host,
      username:
        process.env.NODE_ENV === 'test'
          ? process.env.PG_USERNAME_TEST
          : process.env.PG_USERNAME,
      password:
        process.env.NODE_ENV === 'test'
          ? process.env.PG_PASSWORD_TEST
          : process.env.PG_PASSWORD,
      database:
        process.env.NODE_ENV === 'test'
          ? process.env.PG_DATABASE_TEST
          : defaultOptions.database,
      port:
        process.env.NODE_ENV === 'test'
          ? process.env.PG_PORT_TEST
          : process.env.PG_PORT,
    })
  );
};
