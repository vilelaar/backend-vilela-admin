import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Statements extends BaseSchema {
  protected tableName = 'statements'

  public async up() {
    await this.db
      .rawQuery('CREATE EXTENSION IF NOT EXISTS "uuid-ossp";')
      .exec();

    this.schema.createTable(this.tableName, (table) => {
      table
        .uuid('id')
        .unique()
        .primary()
        .defaultTo(this.db.rawQuery('uuid_generate_v4()').knexQuery);

      table.string('title', 255).notNullable();
      table.string('description', 255).notNullable();
      table.integer('amount').notNullable();
      table.enum('type', ['spending', 'income']).notNullable();
      table.date('date').notNullable();

      table.timestamps(true);
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
