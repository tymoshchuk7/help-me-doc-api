import { knex } from 'knex';
import { getTenantTablesNames } from './helpers';

export const db = knex( {
  client: 'pg',
  connection: {
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT),
    database: process.env.DB_NAME,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
  },
});

export const createTenant = async (userId: string) => {
  const tenantName = `tenant-${userId}`;
  const {
    // eslint-disable-next-line @typescript-eslint/naming-convention
    participants_table, chats_table, messages_table, chat_members_table,
  } = getTenantTablesNames(userId);

  await db.transaction(async (trx) => {
    try {
      await db.schema.createTable(participants_table, (table) => {
        table.increments('id');
        table.integer('user_id').unsigned().references('users.id');
      }).transacting(trx);

      await db.schema.createTable(chats_table, (table) => {
        table.increments('id');
        table.integer('participant_id').unsigned().references(`${participants_table}.id`);
        table.string('status');
      }).transacting(trx);

      await db.schema.createTable(messages_table, (table) => {
        table.increments('id');
        table.integer('participant_id').unsigned().references(`${participants_table}.id`);
        table.integer('chat_id').unsigned().references(`${chats_table}.id`);

        table.text('content');
        table.date('sent_timestamp');
      }).transacting(trx);

      await db.schema.createTable(chat_members_table, (table) => {
        table.increments('id');
        table.integer('participant_id').unsigned().references(`${participants_table}.id`);
        table.integer('user_id').unsigned().references('users.id');
        table.integer('chat_id').unsigned().references(`${chats_table}.id`);
      }).transacting(trx);

      await db('tenants').insert({
        tenant_name: tenantName,
        user_id: userId,
        tenant_participants_table: participants_table,
        tenant_chats_table: chats_table,
        tenant_messages_table: messages_table,
        tenant_chats_members_table: chat_members_table,
      }).transacting(trx);

      await trx.commit();
    } catch (e) {
      console.error(e);
      await trx.rollback();
    }
  });

  return db('tenants').where({ tenant_name: tenantName });
};

//TODO replace this function by migrations
export const initGlobalTables = async () => {
  if (!(await db.schema.hasTable('users'))) {
    await db.schema.createTable('users', (table) => {
      table.increments('id');
      // table.integer('tenant_id').unsigned().references('tenants.id');

      table.string('email').unique();
      table.string('avatar');
      table.string('last_name');
      table.string('first_name');
      table.string('phone_number');
    });
  }
  if (!(await db.schema.hasTable('diseases'))) {
    await db.schema.createTable('diseases', (table) => {
      table.increments('id');
      table.integer('user_id').unsigned().references('users.id');
      table.string('name');
      table.string('status');
      table.text('description');
      table.text('treatment');
    });
  }
  if (!(await db.schema.hasTable('tenants'))) {
    await db.schema.createTable('tenants', (table) => {
      table.increments('id');
      table.integer('user_id').unsigned().references('users.id');

      table.string('tenant_name').unique();
      table.string('tenant_participants_table');
      table.string('tenant_chats_table');
      table.string('tenant_messages_table');
      table.string('tenant_chats_members_table');
    });
  }
  if (!(await db.schema.hasTable('invitations'))) {
    await db.schema.createTable('invitations', (table) => {
      table.increments('id');
      table.integer('tenant_id').unsigned().references('tenants.id');
      table.string('email');
    });
  }
};

