import { knex, Knex } from 'knex';
import { getTenantTablesNames } from './helpers';
import { config } from './config';
import { Tenant, GlobalTableNames } from './types';

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

export abstract class CreateTenantTables {
  database: Knex<any, unknown[]>;

  constructor(database: Knex<any, unknown[]>) {
    this.database = database;
  }

  protected async createTenantParticipantsTable(tenant: Tenant, ctx: any) {
    await this.database.schema.createTable(tenant.tenant_participants_table, (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(this.database.raw('uuid_generate_v4()'));
      table.uuid('user_id').references('users.id').onDelete('CASCADE').notNullable();
      table.string('status');
      table.string('role').notNullable();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    }).transacting(ctx);
  }

  protected async createTenantChatsTable(tenant: Tenant, ctx: any) {
    await this.database.schema.createTable(tenant.tenant_chats_table, (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(this.database.raw('uuid_generate_v4()'));
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    }).transacting(ctx);
  }

  protected async createTenantMessagesTable(tenant: Tenant, ctx: any) {
    await this.database.schema.createTable(tenant.tenant_messages_table, (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(this.database.raw('uuid_generate_v4()'));
      table.uuid('participant_id').references(`${tenant.tenant_participants_table}.id`).onDelete('CASCADE').notNullable();
      table.uuid('chat_id').references(`${tenant.tenant_chats_table}.id`).onDelete('CASCADE').notNullable();
      table.uuid('chat_member_id').references(`${tenant.tenant_chats_members_table}.id`).onDelete('CASCADE').notNullable();
      table.text('content').notNullable();
      table.date('sent_timestamp');
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    }).transacting(ctx);
  }

  protected async createTenantMediaTable(tenant: Tenant, ctx: any) {
    await this.database.schema.createTable(tenant.tenant_media_table, (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(this.database.raw('uuid_generate_v4()'));
      table.string('bucket_path').notNullable();
      table.uuid('message_id').references(`${tenant.tenant_messages_table}.id`).onDelete('CASCADE').notNullable();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    }).transacting(ctx);
  }

  protected async createTenantChatMembersTable(tenant: Tenant, ctx: any) {
    await this.database.schema.createTable(tenant.tenant_chats_members_table, (table) => {
      table.uuid('id', { primaryKey: true }).defaultTo(this.database.raw('uuid_generate_v4()'));
      table.uuid('participant_id').references(`${tenant.tenant_participants_table}.id`).notNullable();
      table.uuid('user_id').references('users.id').onDelete('CASCADE').notNullable();
      table.uuid('chat_id').references(`${tenant.tenant_chats_table}.id`).onDelete('CASCADE').notNullable();
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    }).transacting(ctx);
  }

}

class CreateTenant extends CreateTenantTables {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(database: Knex<any, unknown[]>) {
    super(database);
  }

  async createTenant(tenantDTO: Partial<Tenant>) {
    await this.database.transaction(async (ctx) => {
      try {
        const [tenant]: Tenant[] = await this.database(GlobalTableNames.tenants)
          .insert(tenantDTO)
          .returning([
            'tenant_participants_table',
            'tenant_chats_table',
            'tenant_messages_table',
            'tenant_chats_members_table',
            'tenant_media_table',
          ])
          .transacting(ctx);

        await this.createTenantParticipantsTable(tenant, ctx);
        await this.createTenantChatsTable(tenant, ctx);
        await this.createTenantMessagesTable(tenant, ctx);
        await this.createTenantMediaTable(tenant, ctx);
        await this.createTenantChatMembersTable(tenant, ctx);

        await ctx.commit();
      } catch (e) {
        console.error(e);
        await ctx.rollback();
      }
    });
  }
}

export const createTenant = async (userId: string, name: string) => {
  const tenantName = `tenant-${userId}`;
  const tableNames = getTenantTablesNames(userId);

  const createTenantClient = new CreateTenant(db);
  await createTenantClient.createTenant({
    name,
    user_id: userId,
    tenant_name: tenantName,
    tenant_participants_table: tableNames.participants_table,
    tenant_chats_table: tableNames.chats_table,
    tenant_messages_table: tableNames.messages_table,
    tenant_chats_members_table: tableNames.chat_members_table,
    tenant_media_table: tableNames.media_table,
  });

  const [newTenant] = await db<Tenant>('tenants').where({ tenant_name: tenantName });
  return newTenant;
};

