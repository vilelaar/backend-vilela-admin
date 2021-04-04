import BaseSchema from '@ioc:Adonis/Lucid/Schema'

export default class Balances extends BaseSchema {
  protected tableName = 'balances'

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


      table.integer('amount').notNullable();

      table.timestamps(true)
    })
  }

  public async down() {
    this.schema.dropTable(this.tableName)
  }
}
