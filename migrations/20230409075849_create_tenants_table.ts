import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('tenants', (table) => {
    table.uuid('id').unique();
    table.uuid('user_id').unsigned().references('users.id');

    table.string('tenant_name').unique();
    table.string('tenant_participants_table');
    table.string('tenant_chats_table');
    table.string('tenant_messages_table');
    table.string('tenant_chats_members_table');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('tenants');
}

