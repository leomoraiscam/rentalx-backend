import { Client } from 'pg';

const pgclient = new Client({
  host: process.env.POSTGRES_HOST,
  port: Number(process.env.POSTGRES_PORT),
  user: process.env.POSTGRES_USERNAME,
  password: process.env.POSTGRES_PASSWORD,
  database: process.env.POSTGRES_DB,
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
