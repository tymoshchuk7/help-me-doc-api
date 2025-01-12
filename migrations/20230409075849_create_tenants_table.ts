import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenants', (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('users.id');
    table.string('name').notNullable();
    table.string('tenant_name').unique().notNullable();
    table.string('tenant_participants_table').notNullable();
    table.string('tenant_chats_table').notNullable();
    table.string('tenant_messages_table').notNullable();
    table.string('tenant_chats_members_table').notNullable();
    table.string('tenant_media_table').notNullable();
    table.string('tenant_diseases_table').notNullable();
    table.timestamps(true, true);
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tenants');
}

