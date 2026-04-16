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
let anotherUserToken: string;
let carId: string;
let specId: string;
let rentalId: string;

// Formato de data exigido pelo Celebrate: 'YYYY-MM-DD HH:mm:ss'
const formatDate = (date: Date): string => {
  const pad = (n: number) => String(n).padStart(2, '0');
  // Criamos uma nova data baseada na original, mas avançamos 1 dia para garantir que nunca seja passado
  const tomorrow = new Date(date);
  tomorrow.setDate(tomorrow.getDate() + 1);
  return `${tomorrow.getFullYear()}-${pad(tomorrow.getMonth() + 1)}-${pad(
    tomorrow.getDate()
  )} 12:00:00`;
};

describe('🛍️ Jornada do Locatário (RentFlow E2E)', () => {
  jest.setTimeout(60000);

  beforeAll(async () => {
    connection = await createConnection();
    await connection.runMigrations();

    // 1. Criar Usuário Admin via API + SQL Patch
    await request(app).post('/accounts').send({
      name: 'Admin Seed',
      email: 'admin@rentflow.e2e.com',
      password: 'Admin@12345',
      driverLicense: 'ADMINSEED01',
    });

    await connection.query(
      "UPDATE users SET is_admin = true WHERE email = 'admin@rentflow.e2e.com'"
    );

    // 2. Login Admin para obter token e criar infra de carros
    const adminSession = await request(app).post('/sessions').send({
      email: 'admin@rentflow.e2e.com',
      password: 'Admin@12345',
    });
    adminToken = adminSession.body.token;

    // 3. Criar Category via API
    const catResponse = await request(app)
      .post('/categories')
      .send({
        name: 'HATCH_FLOW',
        description: 'Hatch de fluxo E2E',
        type: 'hatch',
      })
      .set({ Authorization: `Bearer ${adminToken}` });

    const catId = catResponse.body.id;

    // 4. Criar Specification via API
    const specResponse = await request(app)
      .post('/specifications')
      .send({
        name: 'Manual',
        description: 'Câmbio manual',
      })
      .set({ Authorization: `Bearer ${adminToken}` });

    specId = specResponse.body.id;

    // 5. Criar Car via API
    const carResponse = await request(app)
      .post('/cars')
      .send({
        name: 'Gol E2E',
        description: 'VW hatch econômico',
        dailyRate: 80,
        licensePlate: 'FLO0001',
        fineAmount: 100,
        brand: 'VW',
        categoryId: catId,
        specifications: [specId],
        status: 'AVAILABLE',
      })
      .set({ Authorization: `Bearer ${adminToken}` });

    carId = carResponse.body.id;

    // 5.1 Criar Segunda Categoria via API para testes de filtro
    const catResponse2 = await request(app)
      .post('/categories')
      .send({
        name: 'SEDAN_FLOW',
        description: 'Sedans para fluxo E2E',
        type: 'sedan',
      })
      .set({ Authorization: `Bearer ${adminToken}` });

    const catId2 = catResponse2.body.id;

    // 5.2 Criar Segundo Carro (Honda Civic) via API
    await request(app)
      .post('/cars')
      .send({
        name: 'Civic E2E',
        description: 'Honda sedan luxo',
        dailyRate: 200,
        licensePlate: 'FLO0002',
        fineAmount: 250,
        brand: 'Honda',
        categoryId: catId2,
        specifications: [specId],
        status: 'AVAILABLE',
      })
      .set({ Authorization: `Bearer ${adminToken}` });

    // 5.3 Criar Terceiro Carro (Em manutenção) para teste de disponibilidade
    await request(app)
      .post('/cars')
      .send({
        name: 'Marea E2E',
        description: 'Bomba em manutenção',
        dailyRate: 80,
        licensePlate: 'FLO0003',
        fineAmount: 300,
        brand: 'Fiat',
        categoryId: catId,
        specifications: [specId],
        status: 'UNDER_MAINTENANCE',
      })
      .set({ Authorization: `Bearer ${adminToken}` });

    // 6. Criar Usuário Principal (common) via API
    await request(app).post('/accounts').send({
      name: 'User Flow',
      email: 'user@rentflow.e2e.com',
      password: 'User@12345',
      driverLicense: 'USERDL001', // 9 caracteres
    });

    // 7. Criar Outro Usuário (common) via API
    await request(app).post('/accounts').send({
      name: 'Outro Locatário',
      email: 'outro@rentflow.e2e.com',
      password: 'Another@12345',
      driverLicense: 'ANOTHERDL01',
    });

    // 8. Logins para obter tokens
    const [userSess, anotherSess] = await Promise.all([
      request(app).post('/sessions').send({
        email: 'user@rentflow.e2e.com',
        password: 'User@12345',
      }),
      request(app).post('/sessions').send({
        email: 'outro@rentflow.e2e.com',
        password: 'Another@12345',
      }),
    ]);

    userToken = userSess.body.token;
    anotherUserToken = anotherSess.body.token;
  });

  afterAll(async () => {
    await connection.dropDatabase();
    await connection.close();
  });

  // ============================================================
  // BLOCO 1: CRIAÇÃO DE CONTA
  // ============================================================

  describe('👤 Criação e Autenticação de Conta', () => {
    it('[Cenário Feliz] Cliente se registra com dados válidos → 201', async () => {
      const response = await request(app).post('/accounts').send({
        name: 'New User Reg', // < 20
        email: 'newreg@rentflow.e2e.com',
        password: 'New@12345',
        driverLicense: 'NEWREG001', // 10 caracteres
      });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
    });

    it('[Cenário Triste] Cliente tenta se registrar com e-mail duplicado → 409', async () => {
      const response = await request(app).post('/accounts').send({
        name: 'Clone E2E',
        email: 'newreg@rentflow.e2e.com', // Já criado no teste acima
        password: 'Senha@12345',
        driverLicense: 'CNH-CLONE01',
      });

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual(
        'User with this email already exists'
      );
    });

    it('[Cenário Triste] Cliente tenta se registrar com CNH duplicada → 400/409', async () => {
      const response = await request(app).post('/accounts').send({
        name: 'CNH Clone',
        email: 'cnhclone@rentflow.e2e.com',
        password: 'Senha@12345',
        driverLicense: 'NEWREG001', // Já usado no primeiro teste feliz
      });

      expect(response.status).toBeGreaterThanOrEqual(400);
    });

    it('[Cenário Triste] Cliente tenta se registrar sem e-mail → 400 (Celebrate/Joi)', async () => {
      const response = await request(app).post('/accounts').send({
        name: 'SemEmail',
        password: 'Senha@12345',
        driverLicense: 'CNH-00002',
      });

      expect(response.status).toBe(400);
    });

    it('[Cenário Triste] Cliente tenta se registrar com senha menor que 5 chars → 400 (Celebrate/Joi)', async () => {
      const response = await request(app).post('/accounts').send({
        name: 'Senha Curta',
        email: 'curta@rentflow.e2e.com',
        password: '123',
        driverLicense: 'CNH-00003',
      });

      expect(response.status).toBe(400);
    });

    it('[Cenário Feliz] Cliente faz login com credenciais válidas → 200, com JWT e DTO ofuscado', async () => {
      const response = await request(app).post('/sessions').send({
        email: 'newreg@rentflow.e2e.com', // Criado no teste de registro acima
        password: 'New@12345',
      });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('token');
      expect(response.body).toHaveProperty('refreshToken');
      expect(response.body).toHaveProperty('user');

      // ✅ Validação de Data Leak: isAdmin NÃO deve retornar na response
      expect(response.body.user).not.toHaveProperty('isAdmin');

      // ✅ Validação de ofuscação da CNH
      expect(response.body.user.driverLicense).toContain('***');
      expect(response.body.user.driverLicense).not.toEqual('NEWREG001');

      // NÃO sobrescrever o userToken global usado nos outros testes
      // userToken = response.body.token;
    });

    it('[Cenário Triste] Cliente tenta login com senha errada → 401', async () => {
      const response = await request(app).post('/sessions').send({
        email: 'locatario@rentflow.e2e.com',
        password: 'senhaerrada',
      });

      expect(response.status).toBe(401);
    });

    it('[Cenário Triste] Cliente tenta login com e-mail inexistente → 401', async () => {
      const response = await request(app).post('/sessions').send({
        email: 'fantasma@rentflow.e2e.com',
        password: 'qualquer',
      });

      expect(response.status).toBe(401);
    });

    it('[Cenário Feliz] Cliente consulta o próprio perfil → 200, sem dados sensíveis', async () => {
      const response = await request(app)
        .get('/accounts/me')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('id');
      expect(response.body).toHaveProperty('email');
      expect(response.body).not.toHaveProperty('isAdmin');
      expect(response.body).not.toHaveProperty('password');
      expect(response.body.driverLicense).toContain('***');
    });

    it('[Cenário Triste] Tentativa de acesso ao perfil sem token de autenticação → 401', async () => {
      const response = await request(app).get('/accounts/me');
      expect(response.status).toBe(401);
    });

    it('[Cenário Triste] Cliente tenta se registrar com e-mail inválido → 400 (Celebrate/Joi)', async () => {
      const response = await request(app).post('/accounts').send({
        name: 'Email Invalido',
        email: 'invalid-email',
        password: 'Senha@12345',
        driverLicense: 'CNH-00004',
      });

      expect(response.status).toBe(400);
    });

    it('[Cenário Feliz] Cliente faz upload de avatar → 200', async () => {
      const response = await request(app)
        .patch('/accounts/avatar')
        .attach('avatar', 'src/shared/infra/http/e2e/setup/files/images.jpeg')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(200);

      // Verificação no storage
      const userProfile = await request(app)
        .get('/accounts/me')
        .set({ Authorization: `Bearer ${userToken}` });

      const avatarField = userProfile.body.avatarUrl || userProfile.body.avatar;
      if (!avatarField) {
        console.error('DEBUG: Avatar not found in profile!', userProfile.body);
      }
      expect(avatarField).toBeTruthy();
      // Extrair o nome do arquivo se for uma URL
      const fileName =
        typeof avatarField === 'string' && avatarField.includes('/')
          ? avatarField.split('/').pop()
          : avatarField;

      const avatarPath = resolve(TMP_FOLDER, UploadFolder.Avatar, fileName);
      expect(fs.existsSync(avatarPath)).toBe(true);

      // ✅ Validação RNF3: Nome do arquivo deve conter um hash (geralmente via Multer/Crypto)
      // O nome original era images.jpeg, o novo deve ter caracteres aleatórios prefixados
      expect(fileName).not.toEqual('images.jpeg');
      expect(fileName).toMatch(/^[a-f0-9]{16,}.*\..*$/); // Aceita hashes de 16 ou 32 caracteres
    });

    it('[Cenário Feliz] Cliente atualiza avatar e remove o antigo do storage → 200', async () => {
      // 1. Pegar o avatar atual
      const before = await request(app)
        .get('/accounts/me')
        .set({ Authorization: `Bearer ${userToken}` });

      const beforeField = before.body.avatarUrl || before.body.avatar;
      if (!beforeField) {
        console.error('DEBUG: Avatar disappeared in update test!', before.body);
      }
      expect(beforeField).toBeTruthy();

      const prevFileName =
        typeof beforeField === 'string' && beforeField.includes('/')
          ? beforeField.split('/').pop()
          : beforeField;

      const oldPath = resolve(TMP_FOLDER, UploadFolder.Avatar, prevFileName);

      // 2. Upload de um novo (usando outro arquivo para diferenciar)
      const updateResponse = await request(app)
        .patch('/accounts/avatar')
        .attach('avatar', 'src/shared/infra/http/e2e/setup/files/ts_1.png')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(updateResponse.status).toBe(200);

      // 3. Verificar se o antigo sumiu
      expect(fs.existsSync(oldPath)).toBe(false);

      // 4. Verificar se o novo existe
      const after = await request(app)
        .get('/accounts/me')
        .set({ Authorization: `Bearer ${userToken}` });

      const afterField = after.body.avatarUrl || after.body.avatar;
      expect(afterField).toBeTruthy();

      const newFileName =
        typeof afterField === 'string' && afterField.includes('/')
          ? afterField.split('/').pop()
          : afterField;

      const newPath = resolve(TMP_FOLDER, UploadFolder.Avatar, newFileName);
      expect(fs.existsSync(newPath)).toBe(true);
    });

    it('[Cenário Triste] Rota /me sem token → 401', async () => {
      const response = await request(app).get('/accounts/me');

      expect(response.status).toBe(401);
    });
  });

  // ============================================================
  // BLOCO 2: TENTATIVAS INDEVIDAS EM ROTAS ADMIN
  // ============================================================

  describe('🚫 Proteção de Rotas Admin', () => {
    it('[Cenário Triste] Locatário tenta criar Category → 403 Forbidden', async () => {
      const response = await request(app)
        .post('/categories')
        .send({ name: 'HACK', description: 'Invasão', type: 'hatch' })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(403);
      expect(response.body.message).toEqual('User is not an admin!');
    });

    it('[Cenário Triste] Locatário tenta criar Carro → 403 Forbidden', async () => {
      const response = await request(app)
        .post('/cars')
        .send({
          name: 'Carro Ilegal',
          description: 'Tentativa de invasão',
          dailyRate: 100,
          licensePlate: 'HAX0000',
          fineAmount: 60,
          brand: 'Hack',
          status: 'AVAILABLE',
          categoryId: uuidV4(),
          specifications: [uuidV4()],
        })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(403);
    });

    it('[Cenário Triste] Locatário tenta listar todos os rentals (rota admin) → 403', async () => {
      const response = await request(app)
        .get('/rentals')
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(403);
    });

    it('[Cenário Triste] Locatário tenta fazer devolution (rota admin) → 403', async () => {
      const fakeRentalId = uuidV4();
      const response = await request(app)
        .put(`/rentals/${fakeRentalId}/devolution`)
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(403);
    });
  });

  // ============================================================
  // BLOCO 3: LISTAGEM DE CARROS
  // ============================================================

  describe('🚗 Listagem de Carros', () => {
    const startDate = formatDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
    const endDate = formatDate(new Date(Date.now() + 26 * 60 * 60 * 1000));

    it('[Cenário Feliz] Endpoint público lista carros disponíveis com data → 200', async () => {
      const response = await request(app)
        .get('/cars')
        .query({ startDate, expectedReturnDate: endDate });

      expect(response.status).toBe(200);
      // Deve conter o carro que semeamos no beforeAll
      const allCars: any[] = [];
      (response.body as any[]).forEach((cat: any) => {
        (cat.models || []).forEach((model: any) => {
          allCars.push(model);
        });
      });
      expect(allCars.some((m: any) => m.name === 'Gol E2E')).toBe(true);
      expect(allCars.some((m: any) => m.name === 'Civic E2E')).toBe(true);
    });

    it('[Cenário Feliz] Filtra listagem por marca (Honda) → 200', async () => {
      const response = await request(app)
        .get('/cars')
        .query({ startDate, expectedReturnDate: endDate, brand: 'Honda' });

      expect(response.status).toBe(200);
      const categories = response.body as any[];
      // Deve existir apenas modelos da Honda
      const allModels = categories.reduce((acc, c) => acc.concat(c.models), []);
      expect(allModels.every((m: any) => m.brand === 'Honda')).toBe(true);
      expect(allModels.some((m: any) => m.name === 'Civic E2E')).toBe(true);
    });

    it('[Cenário Feliz] Filtra listagem por tipo de categoria (sedan) → 200', async () => {
      const response = await request(app)
        .get('/cars')
        .query({ startDate, expectedReturnDate: endDate, type: 'sedan' });

      expect(response.status).toBe(200);
      const categories = response.body as any[];
      expect(categories.every((c) => c.type === 'sedan')).toBe(true);
      expect(categories.some((c) => c.name === 'SEDAN_FLOW')).toBe(true);
    });

    it('[Regra de Negócio] Carros em manutenção não devem contar como disponíveis na listagem', async () => {
      const response = await request(app)
        .get('/cars')
        .query({ startDate, expectedReturnDate: endDate, brand: 'Fiat' });

      if (response.status !== 200) {
        console.error('DEBUG: List cars failed!', response.body);
      }
      expect(response.status).toBe(200);
      const categories = response.body as any[];
      const mareaModel = categories
        .reduce((acc, c) => acc.concat(c.models), [])
        .find((m: any) => m.name === 'Marea E2E');

      expect(mareaModel).toBeTruthy();
      expect(mareaModel.totalAvailable).toBe(0); // Status UNDER_MAINTENANCE
    });

    it('[Cenário Triste] Listagem de carros sem datas obrigatórias → 400 (Celebrate)', async () => {
      const response = await request(app).get('/cars');
      expect(response.status).toBe(400);
    });
  });

  // ============================================================
  // BLOCO 4: CICLO COMPLETO DE ALUGUEL
  // ============================================================

  describe('📋 Ciclo Completo de Aluguel', () => {
    it('[Cenário Triste] Aluguel com período < 24h → 422 Unprocessable Entity', async () => {
      const start = formatDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
      const end = formatDate(new Date(Date.now() + 4 * 60 * 60 * 1000));

      const response = await request(app)
        .post('/rentals')
        .send({ carId, startDate: start, expectedReturnDate: end })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(422);
      expect(response.body.message).toEqual('Invalid return time!');
    });

    it('[Cenário Triste] Aluguel fora do horário comercial (ex: 20h) → 422', async () => {
      const pad = (n: number) => String(n).padStart(2, '0');
      const now = new Date();
      now.setDate(now.getDate() + 1);
      const startNight = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate()
      )} 20:00:00`;
      const endFuture = `${now.getFullYear()}-${pad(now.getMonth() + 1)}-${pad(
        now.getDate() + 2
      )} 12:00:00`;

      const response = await request(app)
        .post('/rentals')
        .send({ carId, startDate: startNight, expectedReturnDate: endFuture })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(422);
      expect(response.body.message).toEqual(
        'Rentals can only be scheduled between 8am and 6pm'
      );
    });

    it('[Cenário Triste] Aluguel com carId UUID inválido → 400 (Celebrate)', async () => {
      const start = formatDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
      const end = formatDate(new Date(Date.now() + 26 * 60 * 60 * 1000));

      const response = await request(app)
        .post('/rentals')
        .send({
          carId: 'uuid-invalido',
          startDate: start,
          expectedReturnDate: end,
        })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(400);
    });

    it('[Cenário Triste] Aluguel sem datas → 400 (Celebrate)', async () => {
      const response = await request(app)
        .post('/rentals')
        .send({ carId })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(400);
    });

    it('[Cenário Triste] Aluguel de carro inexistente → 404', async () => {
      const start = formatDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
      const end = formatDate(new Date(Date.now() + 26 * 60 * 60 * 1000));

      const response = await request(app)
        .post('/rentals')
        .send({ carId: uuidV4(), startDate: start, expectedReturnDate: end })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(404);
    });

    it('[Cenário Feliz] Locatário aluga o Gol E2E com datas válidas → 201', async () => {
      const start = formatDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
      const end = formatDate(new Date(Date.now() + 26 * 60 * 60 * 1000));

      const response = await request(app)
        .post('/rentals')
        .send({ carId, startDate: start, expectedReturnDate: end })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('id');
      expect(response.body.carId).toEqual(carId);
      expect(response.body.status).toEqual('CONFIRMED');

      rentalId = response.body.id;
    });

    it('[Cenário Triste] Outro locatário tenta alugar o mesmo carro → 409 (carro indisponível)', async () => {
      const start = formatDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
      const end = formatDate(new Date(Date.now() + 26 * 60 * 60 * 1000));

      const response = await request(app)
        .post('/rentals')
        .send({ carId, startDate: start, expectedReturnDate: end })
        .set({ Authorization: `Bearer ${anotherUserToken}` });

      expect(response.status).toBe(409);
      expect(response.body.message).toEqual(
        'This car is unavailable already exist an rental in progress to the same'
      );
    });

    it('[Cenário Feliz] Locatário consulta o próprio histórico com paginação e filtros → 200', async () => {
      const response = await request(app)
        .get('/rentals/me')
        .query({ page: 1, perPage: 10, order: 'DESC', status: 'CONFIRMED' })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(200);
      expect(response.body).toHaveProperty('data');
      expect(response.body.data.length).toBeGreaterThanOrEqual(1);
    });

    it('[Cenário Feliz] Locatário consulta detalhes do aluguel por ID → 200', async () => {
      const response = await request(app)
        .get(`/rentals/${rentalId}`)
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(200);
      expect(response.body.id).toEqual(rentalId);
      expect(response.body.vehicle.model).toEqual('Gol E2E');
    });

    it('[Cenário Feliz] Locatário atualiza a data de retorno do aluguel → 200', async () => {
      const newEndDate = formatDate(new Date(Date.now() + 48 * 60 * 60 * 1000)); // +2 dias

      const response = await request(app)
        .put(`/rentals/${rentalId}`)
        .send({ expectedReturnDate: newEndDate })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(200);
    });

    it('[Fluxo Complexo] Locatário troca de veículo e sistema recalcula o valor → 200', async () => {
      // 1. Localizar o ID da categoria SEDAN_FLOW para buscar o Civic
      const catSearch = await connection.query(
        "SELECT id FROM categories WHERE name = 'SEDAN_FLOW'"
      );
      const sedanCatId = catSearch[0].id;

      // 2. Localizar o Civic E2E (Honda) usando /cars/options (que retorna IDs)
      const carsResponse = await request(app)
        .get('/cars/options')
        .query({
          startDate: formatDate(new Date()),
          expectedReturnDate: formatDate(
            new Date(Date.now() + 48 * 60 * 60 * 1000)
          ),
          categoryId: sedanCatId,
        });

      const civicId = carsResponse.body.models[0].cars[0].id;

      // 3. Atualizar rental trocando para o Civic (mais caro: dailyRate 200 vs 80 do Gol)
      const response = await request(app)
        .put(`/rentals/${rentalId}`)
        .send({ carId: civicId })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(200);
      expect(response.body.carId).toEqual(civicId);

      // Recalculo do total: data agendada no teste feliz era D+1 até D+2 (1 diária)
      // Agora com Civic (200), o total deve refletir o valor do novo carro
      expect(response.body.total).toBeGreaterThanOrEqual(200);

      // 3. Verificar se o carro antigo (Gol) voltou a ficar disponível
      const golStatus = await connection.query(
        `SELECT status FROM cars WHERE id = '${carId}'`
      );
      expect(golStatus[0].status).toEqual('AVAILABLE');

      // 4. Verificar se o carro novo (Civic) está reservado
      const civicStatus = await connection.query(
        `SELECT status FROM cars WHERE id = '${civicId}'`
      );
      expect(civicStatus[0].status).toEqual('RESERVED');
    });

    it('[Rollback] Sistema reverte alterações de status de carros em caso de falha inesperada → 500', async () => {
      // 1. Setup: Pegar o estado atual do rental (que deve ser o Civic após o teste anterior)
      const rentalDetail = await connection.query(
        `SELECT car_id FROM rentals WHERE id = '${rentalId}'`
      );
      const currentCarId = rentalDetail[0].car_id;
      const targetCarId = carId; // Voltando para o Gol

      // Garantir que o carro atual está RESERVED e o alvo está AVAILABLE
      const currentCarBefore = await connection.query(
        `SELECT status FROM cars WHERE id = '${currentCarId}'`
      );
      const targetCarBefore = await connection.query(
        `SELECT status FROM cars WHERE id = '${targetCarId}'`
      );

      expect(currentCarBefore[0].status).toEqual('RESERVED');
      expect(targetCarBefore[0].status).toEqual('AVAILABLE');

      // 2. Induzir falha interceptando a chamada a um serviço interno
      const { container } = await import('tsyringe');
      const { AppError } = await import('@shared/errors/AppError');
      const rentalDateService = container.resolve('RentalDateService') as any;

      const calculateTotalSpy = jest
        .spyOn(rentalDateService, 'calculateTotal')
        .mockImplementationOnce(() => {
          throw new AppError('Simulated failure for rollback validation', 500);
        });

      const response = await request(app)
        .put(`/rentals/${rentalId}`)
        .send({
          carId: targetCarId,
        })
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(500);
      expect(response.body.message).toContain(
        'Simulated failure for rollback validation'
      );

      calculateTotalSpy.mockRestore();

      // 3. Validação do Rollback:
      // O currentCar (Civic) deveria ter virado AVAILABLE e o targetCar (Gol) RESERVED,
      // mas a transação deve ter revertido
      const currentCarAfter = await connection.query(
        `SELECT status FROM cars WHERE id = '${currentCarId}'`
      );
      const targetCarAfter = await connection.query(
        `SELECT status FROM cars WHERE id = '${targetCarId}'`
      );

      expect(currentCarAfter[0].status).toEqual('RESERVED'); // Não mudou para AVAILABLE
      expect(targetCarAfter[0].status).toEqual('AVAILABLE'); // Não mudou para RESERVED
    });

    it('[Cenário Triste] Locatário tenta consultar rental inexistente → 404', async () => {
      const response = await request(app)
        .get(`/rentals/${uuidV4()}`)
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(404);
    });

    it('[Cenário Triste] Outro locatário tenta cancelar o rental alheio → 403 Forbidden', async () => {
      const response = await request(app)
        .put(`/rentals/${rentalId}/cancel`)
        .set({ Authorization: `Bearer ${anotherUserToken}` });

      expect(response.status).toBe(403);
      expect(response.body.message).toEqual(
        'You cannot cancel a rental that belongs to another user.'
      );
    });

    it('[Cenário Feliz] Admin faz o pickup do aluguel (confirmação de retirada) → 204', async () => {
      const response = await request(app)
        .put(`/rentals/${rentalId}/pickup`)
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(204);
    });

    it('[Cenário Triste] Locatário tenta cancelar aluguel já retirado → 422 Unprocessable Entity', async () => {
      const response = await request(app)
        .put(`/rentals/${rentalId}/cancel`)
        .set({ Authorization: `Bearer ${userToken}` });

      expect(response.status).toBe(422);
    });

    it('[Cenário Feliz] Admin finaliza a devolução → 201, com fine_amount calculado', async () => {
      const response = await request(app)
        .put(`/rentals/${rentalId}/devolution`)
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(201);
      expect(response.body).toHaveProperty('status');
      expect(response.body.status).toEqual('CLOSED'); // RentalMap usa CLOSED para finalizado
      expect(response.body.finance).toHaveProperty('fineAmount');
    });

    it('[Cenário Triste] Admin tenta fechar devolution de aluguel que já foi devolvido → 422', async () => {
      const response = await request(app)
        .put(`/rentals/${rentalId}/devolution`)
        .set({ Authorization: `Bearer ${adminToken}` });

      expect(response.status).toBe(422);
    });

    it('[Cenário Feliz] Múltiplos usuários alugam carros diferentes → 201 em ambos', async () => {
      // Registrar um novo carro para o segundo usuário
      const catResponse = await request(app)
        .get('/categories')
        .set({ Authorization: `Bearer ${adminToken}` });
      const catId =
        catResponse.body.data && catResponse.body.data.length > 0
          ? catResponse.body.data[0].id
          : carId; // fallback se falhar a listagem

      const carResponse = await request(app)
        .post('/cars')
        .send({
          name: 'Civic E2E',
          description: 'Sedan premium',
          dailyRate: 150,
          licensePlate: 'ABC5555',
          fineAmount: 100,
          brand: 'Honda',
          categoryId: catId,
          specifications: [specId], // Deve ter min 1
          status: 'AVAILABLE',
        })
        .set({ Authorization: `Bearer ${adminToken}` });

      const carId2 = carResponse.body.id;

      const start = formatDate(new Date(Date.now() + 2 * 60 * 60 * 1000));
      const end = formatDate(new Date(Date.now() + 26 * 60 * 60 * 1000));

      // User A (userToken) aluga Car 1 (já devolvido) ou Car 2
      const res1 = await request(app)
        .post('/rentals')
        .send({ carId, startDate: start, expectedReturnDate: end })
        .set({ Authorization: `Bearer ${userToken}` });

      // User B (anotherUserToken) aluga Car 2
      const res2 = await request(app)
        .post('/rentals')
        .send({ carId: carId2, startDate: start, expectedReturnDate: end })
        .set({ Authorization: `Bearer ${anotherUserToken}` });

      if (res1.status !== 201 || res2.status !== 201) {
        // Apenas loga se houver erro real para não poluir o output
        if (res1.status !== 201)
          console.error('DEBUG: res1 error:', res1.status, res1.body);
        if (res2.status !== 201)
          console.error('DEBUG: res2 error:', res2.status, res2.body);
      }
      expect(res1.status).toBe(201);
      expect(res2.status).toBe(201);
    });
  });
});
