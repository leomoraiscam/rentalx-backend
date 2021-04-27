import { createConnection } from 'typeorm';

async function createDatabase() {
  const connection = await createConnection({
    type: 'postgres',
    host: 'localhost',
    port: 5454,
    username: 'docker',
    password: 'ignite',
    database: 'rentx_test',
  });

  await connection.query(`CREATE DATABASE rentx_test`);

  await connection.close();
}

createDatabase().then(() => console.log('✔️ Database of test created'));
