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

  const newTenant = (await db('tenants').where({ tenant_name: tenantName }))?.[0];
  // eslint-disable-next-line @typescript-eslint/no-unsafe-return
  return newTenant;
};

