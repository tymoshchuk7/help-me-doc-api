import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('invitations', (table) => {
    table.uuid('id').unique();
    table.uuid('tenant');
    table.string('email');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('invitations');
}

