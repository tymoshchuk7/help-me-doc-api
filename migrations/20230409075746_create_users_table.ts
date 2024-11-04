import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('users', (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('default_tenant');
    table.string('email').unique().notNullable();
    table.string('avatar');
    table.string('last_name').notNullable();
    table.string('first_name').notNullable();
    table.string('phone_number');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('users');
}

