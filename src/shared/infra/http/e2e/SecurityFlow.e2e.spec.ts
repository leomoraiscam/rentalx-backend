import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import app from '@shared/infra/http/appTest';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;

describe('🔒 Segurança e Autenticação (SecurityFlow E2E)', () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    // Criar um usuário base para os testes de segurança
    await request(app).post('/accounts').send({
      name: 'Security User',
      email: 'security@rentalx.com.br',
      password: 'Security@123',
      driverLicense: 'SEC-000001',
    });
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  // ============================================================
  // 1. AUTENTICAÇÃO
  // ============================================================
  describe('🔑 Autenticação', () => {
    it('[RF] Deve retornar token e refreshToken ao logar com sucesso', async () => {
      const response = await request(app).post('/sessions').send({
        email: 'security@rentalx.com.br',
        password: 'Security@123',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
    });

    it('[RN] Deve retornar erro genérico para senha incorreta → 401', async () => {
      const response = await request(app).post('/sessions').send({
        email: 'security@rentalx.com.br',
        password: 'WrongPassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Email or password incorrect');
    });

    it('[RN] Deve retornar erro genérico para email inexistente → 401', async () => {
      const response = await request(app).post('/sessions').send({
        email: 'ghost@rentalx.com.br',
        password: 'AnyPassword',
      });

      expect(response.status).toBe(401);
      expect(response.body.message).toEqual('Email or password incorrect');
    });
  });

  // ============================================================
  // 2. RECUPERAÇÃO E REDEFINIÇÃO DE SENHA
  // ============================================================
  describe('📧 Recuperação de Senha', () => {
    it('[RF] Deve gerar token de recuperação no banco para email válido', async () => {
      await request(app).post('/password/forgot').send({
        email: 'security@rentalx.com.br',
      });

      const user = await connection.query(
        "SELECT id FROM users WHERE email = 'security@rentalx.com.br'"
      );
      const userId = user[0].id;

      const userToken = await connection.query(
        `SELECT * FROM users_tokens WHERE user_id = '${userId}' AND type = 'RESET_PASSWORD' AND deleted_at IS NULL`
      );

      expect(userToken.length).toBe(1);
      expect(userToken[0]).toHaveProperty('refresh_token');
      const isUUIDv4 = /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
      expect(userToken[0].id).toMatch(isUUIDv4);
    });

    it('[RN] Deve revogar tokens antigos ao solicitar nova recuperação', async () => {
      // Primeira solicitação já feita no teste acima.
      // Segunda solicitação:
      await request(app).post('/password/forgot').send({
        email: 'security@rentalx.com.br',
      });

      const user = await connection.query(
        "SELECT id FROM users WHERE email = 'security@rentalx.com.br'"
      );
      const userId = user[0].id;

      const userTokens = await connection.query(
        `SELECT * FROM users_tokens WHERE user_id = '${userId}' AND type = 'RESET_PASSWORD' AND deleted_at IS NULL`
      );

      // Deve existir apenas o novo token, o antigo deve ter sido deletado
      expect(userTokens.length).toBe(1);
    });

    it('[RN] Deve falhar ao resetar senha com token inexistente → 404/400', async () => {
      const response = await request(app)
        .post('/password/reset')
        .query({ token: uuidV4() })
        .send({ password: 'NewPassword@123' });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('[RN/RF] Deve redefinir senha com token válido e deslogar globalmente', async () => {
      // 1. Obter token do banco
      const user = await connection.query(
        "SELECT id FROM users WHERE email = 'security@rentalx.com.br'"
      );
      const userId = user[0].id;

      // Criar um refresh token fake para testar o logout global
      await connection.query(
        `INSERT INTO users_tokens (id, refresh_token, user_id, type, expires_date) VALUES ('${uuidV4()}', 'fake-rt', '${userId}', 'refresh_token', NOW())`
      );

      const userToken = await connection.query(
        `SELECT * FROM users_tokens WHERE user_id = '${userId}' AND type = 'RESET_PASSWORD' AND deleted_at IS NULL`
      );
      const token = userToken[0].refresh_token;

      // 2. Resetar
      const response = await request(app)
        .post('/password/reset')
        .query({ token })
        .send({ password: 'NewSecurity@456' });

      expect(response.status).toBe(204 || 200);

      // 3. Verificar se o token de reset foi usado/deletado
      const tokenAfter = await connection.query(
        `SELECT * FROM users_tokens WHERE user_id = '${userId}' AND type = 'RESET_PASSWORD' AND deleted_at IS NULL`
      );
      expect(tokenAfter.length).toBe(0);

      // 4. Verificar Logout Global (Refresh tokens deletados)
      const rtAfter = await connection.query(
        `SELECT * FROM users_tokens WHERE user_id = '${userId}' AND type = 'REFRESH_TOKEN' AND deleted_at IS NULL`
      );
      expect(rtAfter.length).toBe(0);

      // 5. Validar login com a nova senha
      const loginResponse = await request(app).post('/sessions').send({
        email: 'security@rentalx.com.br',
        password: 'NewSecurity@456',
      });
      expect(loginResponse.status).toBe(200);
    });
  });

  // ============================================================
  // 3. REFRESH TOKEN
  // ============================================================
  describe('🔄 Refresh Token', () => {
    it('[RF/RN] Deve rotacionar o refresh token (deletar antigo, criar novo)', async () => {
      // 1. Login para obter RT
      const login = await request(app).post('/sessions').send({
        email: 'security@rentalx.com.br',
        password: 'NewSecurity@456',
      });
      const oldRT = login.body.refreshToken;

      // Aguardar 1s para garantir iat (Issued At) diferente no novo JWT
      await new Promise((resolve) => setTimeout(resolve, 1000));

      // 2. Usar RT para obter novo AT e RT
      const response = await request(app)
        .post('/sessions/refresh-token')
        .send({ token: oldRT });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');

      // 3. Verificar se o antigo foi invalidado/deletado no DB
      const user = await connection.query(
        "SELECT id FROM users WHERE email = 'security@rentalx.com.br'"
      );
      const userId = user[0].id;
      const dbTokens = await connection.query(
        `SELECT * FROM users_tokens WHERE user_id = '${userId}' AND type = 'REFRESH_TOKEN' AND deleted_at IS NULL`
      );
      // Deve existir exatamente um token ativo (o novo), indicando que o antigo foi invalidado
      expect(dbTokens.length).toBe(1);
      expect(dbTokens[0].refresh_token).not.toEqual(oldRT);
    });
  });
});
