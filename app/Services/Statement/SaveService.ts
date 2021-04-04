import Balance from "App/Models/Balance";
import Statement from "App/Models/Statement";

import { DateTime } from "luxon";

interface IRequest {
  title: string;
  description?: string;
  amount: number;
  type: 'spending' | 'income';
  date: DateTime;
}

export default class SaveService {
  public static async execute({ title, description, amount, type, date }: IRequest): Promise<Statement> {
    const statement = await Statement.create({
      title,
      description,
      amount,
      type,
      date,
    });

    const currentBalance = await Balance.findCurrentBalance();

    const amountBalance = type === 'spending'
      ? currentBalance.amount - amount
      : currentBalance.amount + amount;

    currentBalance.amount = amountBalance;

    await currentBalance.save()

    return statement;
  }
}
