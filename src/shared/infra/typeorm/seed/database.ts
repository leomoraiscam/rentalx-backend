import { Client } from 'pg';

const pgclient = new Client({
  host: 'localhost',
  port: process.env.PG_PORT_TEST,
  user: process.env.PG_USERNAME_TEST,
  password: process.env.PG_PASSWORD_TEST,
  database: 'postgres',
});

pgclient.connect();

const table = 'CREATE DATABASE rentx_test';

pgclient.query(table, (err, res) => {
  if (err) {
    console.error('Error: ', err);
    pgclient.end();
  }

  if (res.command === 'CREATE') {
    console.log('✔️ Database of test created');
    pgclient.end();
  }
});
