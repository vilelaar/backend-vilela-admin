import Balance from "App/Models/Balance";
import Statement from "App/Models/Statement";

export default class DeleteService {
  public static async execute(id: string): Promise<void> {
    const currentBalance = await Balance.findCurrentBalance();

    const statement = await Statement.findOrFail(id);

    statement.type === 'spending'
      ? currentBalance.amount += statement.amount
      : currentBalance.amount -= statement.amount

    await statement.delete()
    await currentBalance.save()
  }
}
