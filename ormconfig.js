module.exports = {
  type: "postgres",
  port: process.env.NODE_ENV === 'test' ? process.env.PG_PORT_TEST : process.env.PG_PORT,
  host: "localhost",
  username:  process.env.NODE_ENV === 'test' ? process.env.PG_USERNAME_TEST : process.env.PG_USERNAME,
  password: process.env.NODE_ENV === 'test' ? process.env.PG_PASSWORD_TEST : process.env.PG_PASSWORD,
  database: process.env.NODE_ENV === 'test' ? process.env.PG_DATABASE_TEST : process.env.PG_DATABASE, 
  migrations: ["./src/shared/infra/typeorm/migrations/*.ts"],
  entities: ["./src/modules/**/entities/*.ts"],
  cli: {
    "migrationsDir": "./src/shared/infra/typeorm/migrations"
  }
}
