const configMigrationsDevelopmentPath = "./src/shared/infra/typeorm/migrations/*.ts";
const configMigrationsProductionPath = "./dist/shared/infra/typeorm/migrations/*.js";

const configEntitiesDevelopmentPath = "./src/modules/**/entities/*.ts";
const configEntitiesProductionPath = "./dist/modules/**/entities/*.js";

const configCliDevelopment = {
  "migrationsDir": "./src/shared/infra/typeorm/migrations"
};
const configProduction = {
  "migrationsDir": "./dist/shared/infra/typeorm/migrations"
};

module.exports = {
  type: "postgres",
  port: process.env.NODE_ENV === 'test' ? process.env.PG_PORT_TEST : process.env.PG_PORT,
  host: "localhost",
  username:  process.env.NODE_ENV === 'test' ? process.env.PG_USERNAME_TEST : process.env.PG_USERNAME,
  password: process.env.NODE_ENV === 'test' ? process.env.PG_PASSWORD_TEST : process.env.PG_PASSWORD,
  database: process.env.NODE_ENV === 'test' ? process.env.PG_DATABASE_TEST : process.env.PG_DATABASE, 
  migrations: process.env.NODE_ENV === 'production' ? [configMigrationsProductionPath]: [configMigrationsDevelopmentPath],
  entities: process.env.NODE_ENV === 'production' ? [configEntitiesProductionPath] : [configEntitiesDevelopmentPath],
  cli: process.env.NODE_ENV === 'production' ? configProduction : configCliDevelopment
}
