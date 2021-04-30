import { Client } from 'pg';

const pgclient = new Client({
  host: process.env.PG_HOST_TEST,
  port: Number(process.env.PG_PORT_TEST),
  user: process.env.PG_USERNAME_TEST,
  password: process.env.PG_PASSWORD_TEST,
  database: process.env.PG_DATABASE_TEST,
});

pgclient.connect();

const table = 'CREATE DATABASE rentx_test';

pgclient.query(table, (err, res) => {
  if (err) {
    // eslint-disable-next-line
    console.error('Error: ', err);
    pgclient.end();
  }

  if (res.command === 'CREATE') {
    // eslint-disable-next-line
    console.log('✔️ Database of test created');
    pgclient.end();
  }
});
