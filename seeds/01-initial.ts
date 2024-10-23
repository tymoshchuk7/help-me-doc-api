/* eslint-disable @typescript-eslint/naming-convention */
import { Knex } from 'knex';
import { User, GlobalTableNames, Tenant } from '../app/types';
import { CreateTenantTables } from '../app/database';
import { getTenantTablesNames } from '../app/helpers';

//TODO remove hardcoded tenant id
const hardcodedTenantId = '9866b10b-5833-4cb2-a117-289503870860';

interface ParticipantsDTO {
  userId: string,
  role: string,
}

class CreateInitialData extends CreateTenantTables {
  // eslint-disable-next-line @typescript-eslint/no-useless-constructor
  constructor(database: Knex<any, unknown[]>) {
    super(database);
  }

  async createInitialTenant() {
    await this.database.transaction(async (ctx) => {
      try {
        const [{ id: userId }]: User[] = await this.database(GlobalTableNames.users).insert({
          email: 'test@gmail.com',
          first_name: 'cool',
          last_name: 'doctor',
          default_tenant: hardcodedTenantId,
        }).returning('id').transacting(ctx);

        const tenantName = `tenant-${userId}`;
        const tableNames = getTenantTablesNames(userId);

        const [tenant]: Tenant[] = await this.database(GlobalTableNames.tenants)
          .insert({
            id: hardcodedTenantId,
            user_id: userId,
            name: 'Test',
            tenant_name: tenantName,
            tenant_participants_table: tableNames.participants_table,
            tenant_chats_table: tableNames.chats_table,
            tenant_messages_table: tableNames.messages_table,
            tenant_chats_members_table: tableNames.chat_members_table,
            tenant_media_table: tableNames.media_table,
          })
          .returning([
            'id',
            'tenant_participants_table',
            'tenant_chats_table',
            'tenant_messages_table',
            'tenant_chats_members_table',
            'tenant_media_table',
          ])
          .transacting(ctx);

        await this.createTenantParticipantsTable(tenant, ctx);

        const createdUsers = await this.createInitialUsers(ctx);
        const participantsDTO = (createdUsers as User[]).map(
          (createdUser) => ({ userId: createdUser.id, role: 'patient' }),
        );
        participantsDTO.push({ role: 'chief', userId });
        await this.createInitialParticipants(tenant.tenant_participants_table, participantsDTO, ctx);

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

  private async createInitialUsers(ctx: any) {
    return this.database(GlobalTableNames.users).insert([{
      email: 'placeholder1@gmail.com',
      first_name: 'placeholder1',
      last_name: 'user1',
      default_tenant: hardcodedTenantId,
    }, {
      email: 'placeholder2@gmail.com',
      first_name: 'placeholder2',
      last_name: 'user2',
      default_tenant: hardcodedTenantId,
    }, {
      email: 'placeholder3@gmail.com',
      first_name: 'placeholder3',
      last_name: 'user3',
      default_tenant: hardcodedTenantId,
      // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
    }]).returning('id').transacting(ctx);
  }

  private async createInitialParticipants(participantsTable: string, participantsDTO: ParticipantsDTO[], ctx: any) {
    for (const { role, userId } of participantsDTO) {
      await this.database(participantsTable).insert({
        role, user_id: userId,
        // eslint-disable-next-line @typescript-eslint/no-unsafe-argument
      }).transacting(ctx);
    }
  }
}

export async function seed(knex: Knex) {
  const client = new CreateInitialData(knex);
  return client.createInitialTenant();
}