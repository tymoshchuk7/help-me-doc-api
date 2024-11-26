/* eslint-disable max-lines */
import { Knex } from 'knex';
import { GlobalTableNames, Tenant } from '../types';
import { db } from '../database';
import { getTenantTablesNames } from '../helpers';
import ParticipantController from './participantController';
import ChatController from './chatController';
import ChatMemberController from './chatMemberController';
import MessageController from './messageController';

export type TenantControllerSet = Tenant & {
  ParticipantController: ParticipantController,
  ChatController: ChatController,
  ChatMemberController: ChatMemberController,
  ChatMessageController: MessageController
};

const serializeValue = (tenant: Tenant): TenantControllerSet => ({
  ...tenant,
  ParticipantController: new ParticipantController(tenant),
  ChatController: new ChatController(tenant),
  ChatMemberController: new ChatMemberController(tenant),
  ChatMessageController: new MessageController(tenant),
});

export function createTenantParticipantsTable(tenant: Tenant, ctx: Knex.Transaction) {
  return db.schema.createTable(tenant.tenant_participants_table, (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('users.id').onDelete('CASCADE').notNullable();
    table.string('status');
    table.string('role').notNullable();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }).transacting(ctx);
}

export function createTenantChatsTable(tenant: Tenant, ctx: Knex.Transaction) {
  return db.schema.createTable(tenant.tenant_chats_table, (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }).transacting(ctx);
}

export function createTenantMessagesTable(tenant: Tenant, ctx: Knex.Transaction) {
  return db.schema.createTable(tenant.tenant_messages_table, (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
    table.uuid('chat_id').references(`${tenant.tenant_chats_table}.id`).onDelete('CASCADE').notNullable();
    table.uuid('chat_member_id').references(`${tenant.tenant_chats_members_table}.id`).onDelete('CASCADE').notNullable();
    table.text('content').notNullable();
    table.date('sent_timestamp').notNullable();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }).transacting(ctx);
}

export function createTenantMediaTable(tenant: Tenant, ctx: Knex.Transaction) {
  return db.schema.createTable(tenant.tenant_media_table, (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
    table.string('bucket_path').notNullable();
    table.uuid('message_id').references(`${tenant.tenant_messages_table}.id`).onDelete('CASCADE').notNullable();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }).transacting(ctx);
}

export function createTenantChatMembersTable(tenant: Tenant, ctx: Knex.Transaction) {
  return db.schema.createTable(tenant.tenant_chats_members_table, (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(db.raw('uuid_generate_v4()'));
    table.uuid('participant_id').references(`${tenant.tenant_participants_table}.id`).notNullable();
    table.uuid('chat_id').references(`${tenant.tenant_chats_table}.id`).onDelete('CASCADE').notNullable();
    // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
  }).transacting(ctx);
}

class TenantController {

  columns: string[];

  constructor() {
    this.columns = [
      'id',
      'user_id',
      'name',
      'tenant_name',
      'tenant_participants_table',
      'tenant_chats_table',
      'tenant_messages_table',
      'tenant_chats_members_table',
      'tenant_media_table',
    ];
  }

  async create(value: Pick<Tenant, 'name' | 'user_id'>): Promise<TenantControllerSet> {
    const tenantName = `tenant-${value.user_id}`;
    const tableNames = getTenantTablesNames(value.user_id);

    const result = await db.transaction(async (ctx) => {
      try {
        const [tenant]: Tenant[] = await db(GlobalTableNames.tenants)
          .insert({
            name: value.name,
            user_id: value.user_id,
            tenant_name: tenantName,
            tenant_participants_table: tableNames.participants_table,
            tenant_chats_table: tableNames.chats_table,
            tenant_messages_table: tableNames.messages_table,
            tenant_chats_members_table: tableNames.chat_members_table,
            tenant_media_table: tableNames.media_table,
          })
          .returning('*')
          .transacting(ctx);

        await createTenantParticipantsTable(tenant, ctx);
        await createTenantChatsTable(tenant, ctx);
        await createTenantChatMembersTable(tenant, ctx);
        await createTenantMessagesTable(tenant, ctx);
        await createTenantMediaTable(tenant, ctx);

        await ctx.commit();

        return tenant;
      } catch (e) {
        console.error(e);
        await ctx.rollback();
      }
    });

    if (!result) {
      throw new Error('Tenant has not been created');
    }

    return serializeValue(result);
  }


  async seedTenantTable(value: Pick<Tenant, 'name' | 'user_id' | 'id'>, ctx: Knex.Transaction): Promise<TenantControllerSet | undefined> {
    const tenantName = `tenant-${value.user_id}`;
    const tableNames = getTenantTablesNames(value.user_id);

    const [tenant]: Tenant[] = await db(GlobalTableNames.tenants)
      .insert({
        id: value.id,
        name: value.name,
        user_id: value.user_id,
        tenant_name: tenantName,
        tenant_participants_table: tableNames.participants_table,
        tenant_chats_table: tableNames.chats_table,
        tenant_messages_table: tableNames.messages_table,
        tenant_chats_members_table: tableNames.chat_members_table,
        tenant_media_table: tableNames.media_table,
      })
      .returning('*')
      .transacting(ctx);

    await createTenantParticipantsTable(tenant, ctx);
    await createTenantChatsTable(tenant, ctx);
    await createTenantChatMembersTable(tenant, ctx);
    await createTenantMessagesTable(tenant, ctx);
    await createTenantMediaTable(tenant, ctx);

    return serializeValue(tenant);
  }

  async findOne(condition: Partial<Tenant>): Promise<TenantControllerSet | undefined> {
    const [result] = await db(GlobalTableNames.tenants).where(condition);
    return serializeValue(result as Tenant);
  }

  async findOneById(id: string): Promise<TenantControllerSet | undefined> {
    return this.findOne({ id });
  }
}

export default new TenantController();