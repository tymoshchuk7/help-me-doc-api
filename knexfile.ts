import type { Knex } from 'knex';
import { config } from './app/config';

const knexConfig: { [key: string]: Knex.Config } = {
  development: {
    client: 'pg',
    connection: config.databaseConnectionUrl,
    seeds: {
      directory: './seeds',
    },
    migrations: {
      directory: './migrations',
    },
  },
};

module.exports = knexConfig;
