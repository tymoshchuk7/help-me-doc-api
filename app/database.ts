import { knex } from 'knex';
import { getTenantTablesNames } from './helpers';
import { Tenant } from './types';

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
    participants_table, chats_table, messages_table, chat_members_table, media_table,
  } = getTenantTablesNames(userId);

  await db.transaction(async (trx) => {
    try {
      await db<Tenant>('tenants').insert({
        tenant_name: tenantName,
        user_id: userId,
        tenant_participants_table: participants_table,
        tenant_chats_table: chats_table,
        tenant_messages_table: messages_table,
        tenant_chats_members_table: chat_members_table,
        tenant_media_table: media_table,
      }).transacting(trx);

      await db.schema.createTable(participants_table, (table) => {
        table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
        table.uuid('user_id').references('users.id').onDelete('CASCADE');
        table.string('status');
        table.string('role');
      }).transacting(trx);

      await db.schema.createTable(chats_table, (table) => {
        table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
      }).transacting(trx);

      await db.schema.createTable(messages_table, (table) => {
        table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
        table.uuid('participant_id').references(`${participants_table}.id`).onDelete('CASCADE');
        table.uuid('chat_id').references(`${chats_table}.id`).onDelete('CASCADE');

        table.text('content');
        table.date('sent_timestamp');
      }).transacting(trx);

      await db.schema.createTable(media_table, (table) => {
        table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
        table.string('bucket_path');
        table.uuid('message_id').references(`${messages_table}.id`).onDelete('CASCADE');
      }).transacting(trx);

      await db.schema.createTable(chat_members_table, (table) => {
        table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
        table.uuid('participant_id').references(`${participants_table}.id`);
        table.uuid('user_id').references('users.id').onDelete('CASCADE');
        table.uuid('chat_id').references(`${chats_table}.id`).onDelete('CASCADE');
      }).transacting(trx);

      await trx.commit();
    } catch (e) {
      await trx.rollback();
    }
  });

  const [newTenant] = await db<Tenant>('tenants').where({ tenant_name: tenantName });
  return newTenant;
};

