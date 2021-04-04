import { DateTime } from 'luxon'
import { BaseModel, column } from '@ioc:Adonis/Lucid/Orm'

export default class Balance extends BaseModel {
  @column({ isPrimary: true })
  public id: number

  @column()
  public amount: number

  @column.dateTime({ autoCreate: true })
  public createdAt: DateTime

  @column.dateTime({ autoCreate: true, autoUpdate: true })
  public updatedAt: DateTime

  public static async findCurrentBalance(): Promise<Balance> {
    const lastBalance = await Balance.query().orderBy('createdAt', 'desc').first();

    if (!lastBalance) {
      return await Balance.create({ amount: 0 });
    }

    return lastBalance;
  }
}
