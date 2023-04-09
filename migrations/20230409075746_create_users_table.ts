import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.increments('id');
    // table.integer('tenant_id').unsigned().references('tenants.id');

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

