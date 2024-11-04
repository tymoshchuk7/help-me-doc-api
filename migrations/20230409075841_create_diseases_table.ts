import { Knex } from 'knex';

export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('diseases', (table) => {
    table.uuid('id', { primaryKey: true }).defaultTo(knex.raw('uuid_generate_v4()'));
    table.uuid('user_id').references('users.id');
    table.string('name').notNullable();
    table.string('status').notNullable();
    table.text('description');
    table.text('treatment');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diseases');
}

