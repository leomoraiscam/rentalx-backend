import { Connection } from 'typeorm';

import createConnection from '@shared/infra/typeorm';

let connection: Connection;

class Main {
  async generateDatabase() {
    connection = await createConnection();
    await connection.runMigrations();

    await connection.query('CREATE DATABASE rentx_test');
    await connection.close();
  }
}

const calledDatabase = new Main();

calledDatabase.generateDatabase();
