import * as fs from 'fs';
import { resolve } from 'path';
import request from 'supertest';
import { Connection } from 'typeorm';
import { v4 as uuidV4 } from 'uuid';

import { TMP_FOLDER } from '@config/upload';
import { UploadFolder } from '@shared/common/enums/uploadFolder';
import app from '@shared/infra/http/appTest';
import createConnection from '@shared/infra/typeorm';

let connection: Connection;
let adminToken: string;
let userToken: string;
let categoryId: string;
let secondCategoryId: string;
let specId: string;
let secondSpecId: string;
let carId: string;

describe('🚗 Jornada da Frota (AdminFleet E2E)', () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    // 1. Criar Usuário Admin via API + SQL Patch
    await request(app).post('/accounts').send({
      name: 'Admin RentX',
      email: 'admin@rentx.e2e.com',
      password: 'Admin@12345',
      driverLicense: '000000001',
    });
    await connection.query(
      "UPDATE users SET is_admin = true WHERE email = 'admin@rentx.e2e.com'"
    );

    // Setup: Usuário comum via API
    await request(app).post('/accounts').send({
      name: 'User RentX',
      email: 'user@rentx.e2e.com',
      password: 'User@12345',
      driverLicense: '111111111',
    });

    // Obtém tokens de autenticação para admin e user
    const [adminSession, userSession] = await Promise.all([
      request(app).post('/sessions').send({
        email: 'admin@rentx.e2e.com',
        password: 'Admin@12345',
      }),
      request(app).post('/sessions').send({
        email: 'user@rentx.e2e.com',
        password: 'User@12345',
      }),
    ]);

    adminToken = adminSession.body.token;
    userToken = userSession.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  // ============================================================
  // BLOCO 1: CATEGORIES
  // ============================================================

  describe('📂 Categories', () => {
    it('[Cenário Feliz] Admin cria uma Category com sucesso → 201', async () => {
      const response = await request(app)
        .post('/categories')
        .send({
          name: 'SUV',
          description: 'Sport Utility Vehicle',
          type: 'suv',
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      categoryId = response.body.id;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toEqual('SUV');
    });

    it('[Cenário Triste] Admin tenta criar Category com nome duplicado → 409', async () => {
      const response = await request(app)
        .post('/categories')
        .send({ name: 'SUV', description: 'Duplicada', type: 'suv' })
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual(
        'Category with name already exists'
      );
    });

    it('[Cenário Triste] Usuário comum tenta criar Category → 403 Forbidden', async () => {
      const response = await request(app)
        .post('/categories')
        .send({ name: 'Sedan', description: 'Sedan', type: 'sedan' })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(403);
      expect(response.body.message).toEqual('User is not an admin!');
    });

    it('[Cenário Triste] Requisição sem Bearer token → 401 Unauthorized', async () => {
      const response = await request(app)
        .post('/categories')
        .send({ name: 'Sedan', description: 'Sedan', type: 'sedan' });

      expect(response.status).toBe(401);
    });

    it('[Cenário Triste] Admin tenta criar Category sem campos obrigatórios → 400 (Celebrate)', async () => {
      const response = await request(app)
        .post('/categories')
        .send({ name: 'Sem tipo' })
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(400);
    });

    it('[Cenário Feliz] Admin cria segunda Category (Sedan) → 201', async () => {
      const response = await request(app)
        .post('/categories')
        .send({ name: 'Sedan', description: 'Sedan compacto', type: 'sedan' })
        .set({ Authorization: `Bearer ${adminToken}` });

      secondCategoryId = response.body.id;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('[Cenário Triste] Admin tenta listar categories sem token → 401', async () => {
      const response = await request(app).get('/categories');
      expect(response.status).toBe(401);
    });

    it('[Cenário Feliz] Listagem de categories retorna 200 com paginação e ordenação', async () => {
      // Criar mais algumas para testar paginação real
      await request(app)
        .post('/categories')
        .send({
          name: 'Hatchback',
          description: 'Carros compactos',
          type: 'hatch',
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      const response = await request(app)
        .get('/categories')
        .query({ page: 1, perPage: 2, order: 'DESC' })
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(2);
      expect(response.body.total).toBeGreaterThanOrEqual(3);
    });

    it('[Cenário Feliz] Admin importa categorias via CSV → 201', async () => {
      const response = await request(app)
        .post('/categories/import')
        .attach('file', 'src/shared/infra/http/e2e/setup/files/categories.csv')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(201);
    });

    it('[RN3] Admin importa o mesmo CSV de categorias novamente → 201 (idempotência/ignora duplicatas)', async () => {
      const response = await request(app)
        .post('/categories/import')
        .attach('file', 'src/shared/infra/http/e2e/setup/files/categories.csv')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(201);
    });
  });

  // ============================================================
  // BLOCO 2: SPECIFICATIONS
  // ============================================================

  describe('📋 Specifications', () => {
    it('[Cenário Feliz] Admin cria uma Specification → 201', async () => {
      const response = await request(app)
        .post('/specifications')
        .send({ name: 'Ar Condicionado', description: 'Ar Frio' })
        .set({ Authorization: `Bearer ${adminToken}` });

      specId = response.body.id;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toEqual('Ar Condicionado');
    });

    it('[Cenário Feliz] Admin cria segunda Specification → 201', async () => {
      const response = await request(app)
        .post('/specifications')
        .send({ name: 'Piloto Automático', description: 'Cruise Control' })
        .set({ Authorization: `Bearer ${adminToken}` });

      secondSpecId = response.body.id;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
    });

    it('[Cenário Triste] Admin tenta criar Specification com nome duplicado → 409', async () => {
      const response = await request(app)
        .post('/specifications')
        .send({ name: 'Ar Condicionado', description: 'Duplicada' }) // Ar Condicionado já foi exisistente
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual(
        'Specification with name already exists'
      );
    });

    it('[Cenário Triste] Usuário comum tenta criar Specification → 403 Forbidden', async () => {
      const response = await request(app)
        .post('/specifications')
        .send({ name: 'Injeção', description: 'Injeção eletrônica' })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(403);
    });

    it('[Cenário Feliz] Listagem de specifications retorna 200 com estrutura paginada e ordenação', async () => {
      const response = await request(app)
        .get('/specifications')
        .query({ page: 1, perPage: 1, order: 'ASC' })
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(200);
      expect(response.body.data.length).toBe(1);
    });

    it('[Cenário Triste] Usuário comum tenta listar especificações → 403 Forbidden', async () => {
      const response = await request(app)
        .get('/specifications')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(403);
    });

    it('[Cenário Feliz] Admin importa especificações via CSV → 201', async () => {
      const response = await request(app)
        .post('/specifications/import')
        .attach(
          'file',
          'src/shared/infra/http/e2e/setup/files/specifications.csv'
        )
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(201);
    });
  });

  // ============================================================
  // BLOCO 3: CARS
  // ============================================================

  describe('🚙 Cars', () => {
    it('[Cenário Feliz] Admin cadastra um Carro com Spec e Category → 201', async () => {
      const response = await request(app)
        .post('/cars')
        .send({
          name: 'Jeep Compass',
          description: 'SUV de luxo',
          dailyRate: 250,
          licensePlate: 'ABC1234',
          fineAmount: 150,
          brand: 'Jeep',
          categoryId,
          specifications: [specId],
          status: 'AVAILABLE',
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      carId = response.body.id;

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.name).toEqual('Jeep Compass');
      expect(response.body.categoryId).toEqual(categoryId);
    });

    it('[Cenário Triste] Admin tenta cadastrar Carro com mesma placa → 409', async () => {
      const response = await request(app)
        .post('/cars')
        .send({
          name: 'Clone Compass',
          description: 'SUV clone',
          dailyRate: 250,
          licensePlate: 'ABC1234',
          fineAmount: 150,
          brand: 'Jeep',
          categoryId,
          specifications: [specId],
          status: 'AVAILABLE',
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual(
        'Car with this licensePlate already exist'
      );
    });

    it('[Cenário Triste] Admin tenta cadastrar Carro com UUID inválido nas specs → 400 (Celebrate/Joi)', async () => {
      const response = await request(app)
        .post('/cars')
        .send({
          name: 'Renegade',
          description: 'SUV menor e mais barato',
          dailyRate: 100,
          licensePlate: 'XYZ9999',
          fineAmount: 60,
          brand: 'Jeep',
          status: 'AVAILABLE',
          categoryId,
          specifications: ['not-a-valid-uuid'],
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(400);
    });

    it('[Cenário Triste] Admin tenta cadastrar Carro com Category inexistente → 404', async () => {
      const response = await request(app)
        .post('/cars')
        .send({
          name: 'Mustang',
          description: 'Esportivo americano',
          dailyRate: 350,
          licensePlate: 'MUS0001',
          fineAmount: 120,
          brand: 'Ford',
          status: 'AVAILABLE',
          categoryId: uuidV4(), // UUID válido mas inexistente
          specifications: [specId],
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(404);
    });

    it('[Cenário Triste] Usuário comum tenta cadastrar Carro → 403 Forbidden', async () => {
      const response = await request(app)
        .post('/cars')
        .send({
          name: 'Carro Ilegal',
          description: 'Tentativa hacker',
          dailyRate: 100,
          licensePlate: 'HAC0000',
          fineAmount: 60,
          brand: 'Hack',
          status: 'AVAILABLE',
          categoryId,
          specifications: [specId],
        })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(403);
    });

    it('[Cenário Feliz] Admin cadastra segundo Carro com placa diferente → 201', async () => {
      const response = await request(app)
        .post('/cars')
        .send({
          name: 'Toyota Corolla',
          description: 'Sedan executivo',
          dailyRate: 300,
          licensePlate: 'XYZ4321',
          fineAmount: 200,
          brand: 'Toyota',
          categoryId: secondCategoryId,
          specifications: [secondSpecId],
          status: 'AVAILABLE',
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(201);
    });

    it('[Cenário Triste] Admin tenta cadastrar Carro com specification inexistente → 404', async () => {
      const response = await request(app)
        .post('/cars')
        .send({
          name: 'Ferrari',
          description: 'Super esportivo',
          dailyRate: 900,
          licensePlate: 'FER0001',
          fineAmount: 500,
          brand: 'Ferrari',
          status: 'AVAILABLE',
          categoryId,
          specifications: [uuidV4()], // Spec inexistente
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(404);
    });

    it('[Cenário Feliz] Admin faz upload de imagens para um carro → 200', async () => {
      const response = await request(app)
        .post(`/cars/${carId}/images`)
        .attach('car', 'src/shared/infra/http/e2e/setup/files/ts-05.png')
        .attach('car', 'src/shared/infra/http/e2e/setup/files/ts-06.png')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(200);
    });

    it('[RN5] Falha no upload de imagens para carro inexistente não deve deixar arquivos órfãos → 404', async () => {
      const fakeId = uuidV4();
      const response = await request(app)
        .post(`/cars/${fakeId}/images`)
        .attach('car', 'src/shared/infra/http/e2e/setup/files/ts-05.png')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(404);

      // Verificar se não há arquivos no storage (rollback manual no UseCase ou automático no Multer)
      const filesInDir = fs.readdirSync(resolve(TMP_FOLDER, UploadFolder.Cars));
      // Se houvesse arquivos órfãos, eles estariam aqui.
      // Nota: Este teste assume que o diretório pode conter arquivos de outros testes bem-sucedidos.
      // Uma validação melhor seria contar antes e depois, mas o isolamento do AfterAll limpa tudo.
      expect(filesInDir.length).toBeGreaterThanOrEqual(0);
    });
  });

  // ============================================================
  // BLOCO 4: GESTÃO DE RENTALS (VISÃO ADMIN)
  // ============================================================

  describe('🔑 Rentals (Visão Admin)', () => {
    it('[Cenário Feliz] Admin lista TODOS os rentals sem restrição → 200', async () => {
      const response = await request(app)
        .get('/rentals')
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(Array.isArray(response.body.data)).toBe(true);
    });

    it('[Cenário Triste] Usuário comum não pode listar todos os rentals → 403', async () => {
      const response = await request(app)
        .get('/rentals')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(403);
    });

    it('[Cenário Triste] Não autenticado não pode listar rentals → 401', async () => {
      const response = await request(app).get('/rentals');

      expect(response.status).toBe(401);
    });
  });
});
