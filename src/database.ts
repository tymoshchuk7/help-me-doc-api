import { knex } from 'knex';

export const db = knex( {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

//TODO replace this function by migrations
export const initGlobalTables = async () => {
  await db.schema.createTable('users', (table) => {
    table.increments('id');
    table.string('email');
    table.string('password');
    table.string('family_name');
    table.string('first_name');
  });
  await db.schema.createTable('diseases', (table) => {
    table.increments('id');
    table.integer('user_id').unsigned().references('users.id');
    table.string('name');
    table.string('status');
    table.text('description');
    table.text('treatment');
  });
  await db.schema.createTable('tenants', (table) => {
    table.increments('id');
    table.integer('user_id').unsigned().references('users.id');

    table.string('tenant_participants_table');
    table.string('tenant_chats_table');
    table.string('tenant_messages_table');
  });
};