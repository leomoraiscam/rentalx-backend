"use strict";

var _bcryptjs = require("bcryptjs");

var _supertest = _interopRequireDefault(require("supertest"));

var _uuid = require("uuid");

var _app = _interopRequireDefault(require("@shared/infra/http/app"));

var _typeorm = _interopRequireDefault(require("@shared/infra/typeorm"));

function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

let connection;
describe('Create Category Controller', () => {
  beforeAll(async () => {
    connection = await (0, _typeorm.default)();
    await connection.runMigrations();
    const id = (0, _uuid.v4)();
    const password = await (0, _bcryptjs.hash)('admin', 8);
    await connection.query(`INSERT INTO 
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
    `);
  });
  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });
  it('should be able create a new category in db', async () => {
    const responseToken = await await (0, _supertest.default)(_app.default).post('/sessions').send({
      email: 'email@admin.com',
      password: 'admin'
    });
    const {
      refresh_token
    } = responseToken.body;
    const response = await (0, _supertest.default)(_app.default).post('/categories').send({
      name: 'Category supertest',
      description: 'Category supertest'
    }).set({
      Authorization: `Bearer ${refresh_token}`
    });
    expect(response.status).toBe(201);
  });
  it('should not be able create a new category in db with name exist', async () => {
    const responseToken = await await (0, _supertest.default)(_app.default).post('/sessions').send({
      email: 'email@admin.com',
      password: 'admin'
    });
    const {
      token
    } = responseToken.body;
    const response = await (0, _supertest.default)(_app.default).post('/categories').send({
      name: 'Category supertest',
      description: 'Category supertest'
    }).set({
      Authorization: `Bearer ${token}`
    });
    expect(response.status).toBe(400);
  });
});