import request from 'supertest';

import app from '@shared/infra/http/app';

describe('Create Category Controller', () => {
  it('should be able create a new category in db', async () => {
    await request(app).get('/cars/available').expect(200);
  });
});
