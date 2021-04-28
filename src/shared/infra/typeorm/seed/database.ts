import { Client } from 'pg';

const pgclient = new Client({
  host: 'localhost',
  port: 5432,
  user: 'postgres',
  password: 'psqldb@20',
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
