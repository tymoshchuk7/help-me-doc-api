import { Knex } from 'knex';
import { User, GlobalTableNames } from '../app/types';

//TODO remove hardcoded tenant id
const hardcodedTenantId = '9866b10b-5833-4cb2-a117-289503870860';

export async function seed(knex: Knex) {
  await knex.transaction(async (ctx) => {
    try {
      //this one has credentials for authentication via auth0
      const [{ id: userId }] = await knex(GlobalTableNames.users).insert({
        email: 'test@gmail.com',
        first_name: 'cool',
        last_name: 'doctor',
        defaultTenant: hardcodedTenantId,
      }).returning('id').transacting(ctx);

      // eslint-disable-next-line @typescript-eslint/naming-convention
      const [{ tenant_participants_table }] = await knex(GlobalTableNames.tenants).insert({
        id: hardcodedTenantId,
        tenant_name: `tenant_${userId}`,
        user_id: userId,
        tenant_participants_table: `tenant_${userId}_participants`,
        tenant_chats_table: `tenant_${userId}_chats`,
        tenant_messages_table: `tenant_${userId}_messages`,
        tenant_chats_members_table: `tenant_${userId}_chat_members`,
        tenant_media_table: `tenant_${userId}_media`,
      }).returning(['tenant_participants_table', 'id']).transacting(ctx);

      await knex.schema.createTable(tenant_participants_table as string, (table) => {
        table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
        table.uuid('user_id').references('users.id').onDelete('CASCADE');
        table.string('status');
        table.string('role');
      }).transacting(ctx);

      const createdUsers = await knex(GlobalTableNames.users).insert([{
        email: 'placeholder1@gmail.com',
        first_name: 'placeholder1',
        last_name: 'user1',
        defaultTenant: hardcodedTenantId,
      }, {
        email: 'placeholder2@gmail.com',
        first_name: 'placeholder2',
        last_name: 'user2',
        defaultTenant: hardcodedTenantId,
      }, {
        email: 'placeholder3@gmail.com',
        first_name: 'placeholder3',
        last_name: 'user3',
        defaultTenant: hardcodedTenantId,
      }]).returning('id').transacting(ctx);

      await knex(tenant_participants_table as string).insert({
        role: 'chief', user_id: userId,
      }).transacting(ctx);
      for (const createdUser of createdUsers as User[]) {
        await knex(tenant_participants_table as string).insert({
          role: 'patient', user_id: createdUser.id,
        }).transacting(ctx);
      }

      await ctx.commit();
    } catch (e) {
      await ctx.rollback();
      console.error(e);
    }
  });
}