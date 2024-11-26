import { knex } from 'knex';
import { config } from './config';

export const db = knex( {
  client: 'pg',
  connection: {
    host: config.dbHost,
    port: config.dbPort,
    database: config.dbName,
    user: config.dbUser,
    password: config.dbPassword,
  },
});
