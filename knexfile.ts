import type { Knex } from 'knex';
import { config } from './app/config';

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: {
      host: config.dbHost,
      port: config.dbPort,
      database: config.dbName,
      user: config.dbUser,
      password: config.dbPassword,
    },
    seeds: {
      directory: './seeds',
    },
    migrations: {
      directory: './migrations',
    },
  },
};

module.exports = knexConfig;
