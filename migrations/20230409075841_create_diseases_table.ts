import { Knex } from 'knex';


export async function up(knex: Knex): Promise<void> {
  await knex.schema.createTable('diseases', (table) => {
    table.increments('id');
    table.integer('user_id').unsigned().references('users.id');
    table.string('name');
    table.string('status');
    table.text('description');
    table.text('treatment');
  });
}


export async function down(knex: Knex): Promise<void> {
  await knex.schema.dropTable('diseases');
}

