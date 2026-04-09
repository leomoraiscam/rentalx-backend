// Script executado automaticamente antes dos testes (via jest globalSetup)
// Cria o banco de dados de teste 'rentx_test' caso não exista

const { Client } = require('pg');
require('dotenv').config();

module.exports = async () => {
  const client = new Client({
    host: process.env.PG_HOST_TEST || 'localhost',
    port: Number(process.env.PG_PORT_TEST) || 5454,
    user: process.env.PG_USERNAME_TEST || 'docker',
    password: process.env.PG_PASSWORD_TEST || 'ignite',
    database: 'postgres', // Conecta no banco padrão para criar o rentx_test
  });

  await client.connect();

  const result = await client.query(
    `SELECT 1 FROM pg_database WHERE datname = '${process.env.PG_DATABASE_TEST || 'rentx_test'}'`
  );

  if (result.rowCount === 0) {
    await client.query(`CREATE DATABASE ${process.env.PG_DATABASE_TEST || 'rentx_test'}`);
    console.log('✅ Banco de testes criado: rentx_test');
  } else {
    console.log('ℹ️  Banco de testes já existe: rentx_test');
  }

  await client.end();
};
