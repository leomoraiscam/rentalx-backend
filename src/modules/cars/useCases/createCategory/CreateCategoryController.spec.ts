import { hash } from 'bcryptjs';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidv4 } from 'uuid';

import app from '@shared/infra/http/app';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    const id = uuidv4();
    const password = await hash('admin', 8);

    await connection.query(
      `INSERT INTO 
      users 
      (
        id, 
        name, 
        email, 
        password, 
        "isAdmin", 
        created_at,
        driver_license
      )
      VALUES (
        '${id}', 
        'Leonardo', 
        'email@admin.com', 
        '${password}', 
        'true', 
        'now()',
        'XXXXXX'
      ) 
    `
    );
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  it('should be able create a new category in db', async () => {
    const responseToken = await await request(app)
      .post('/sessions')
      .send({ email: 'email@admin.com', password: 'admin' });

    const { refresh_token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category supertest',
        description: 'Category supertest',
      })
      .set({
        Authorization: `Bearer ${refresh_token}`,
      });

    expect(response.status).toBe(201);
  });

  it('should not be able create a new category in db with name exist', async () => {
    const responseToken = await await request(app)
      .post('/sessions')
      .send({ email: 'email@admin.com', password: 'admin' });

    const { token } = responseToken.body;

    const response = await request(app)
      .post('/categories')
      .send({
        name: 'Category supertest',
        description: 'Category supertest',
      })
      .set({
        Authorization: `Bearer ${token}`,
      });

    expect(response.status).toBe(400);
  });
});
