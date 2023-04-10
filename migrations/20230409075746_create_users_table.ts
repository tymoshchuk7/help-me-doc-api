import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id').unique();
    table.uuid('defaultTenant');

    table.string('email').unique();
    table.string('avatar');
    table.string('last_name');
    table.string('first_name');
    table.string('phone_number');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}

