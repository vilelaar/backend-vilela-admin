import IListStatementDto, { IStatementItem } from "App/dtos/IListStatementDto";

import Balance from "App/Models/Balance";
import Statement from "App/Models/Statement";

interface IRequest {
  year: string;
  month: string;
}

export default class ListService {
  public static async execute({ year, month }: IRequest): Promise<IListStatementDto> {
    const currentBalance = await Balance.findCurrentBalance();

    const currentIncome = await Statement
      .query()
      .whereRaw("to_char(date, 'YYYY-MM') = ?", [`${year}-${month}`])
      .where('type', 'income')

    const currentSpending = await Statement
      .query()
      .whereRaw("to_char(date, 'YYYY-MM') = ?", [`${year}-${month}`])
      .where('type', 'spending')

    // amount
    let totalIncome = 0;
    currentIncome.forEach(item => totalIncome += item.amount)

    let totalSpending = 0;
    currentSpending.forEach(item => totalSpending += item.amount)

    // format
    const reduceStatement = (item: Statement, arrToReduce: IStatementItem[]) => {
      if (arrToReduce.length === 0) {
        arrToReduce.push({ date: item.date, list: [item] })
        return;
      }
      const incomeIndex = arrToReduce.findIndex(income =>
        income.date.toString() === item.date.toString()
      )

      if (incomeIndex === -1) {
        arrToReduce.push({ date: item.date, list: [item] })
        return;
      }

      arrToReduce[incomeIndex].list.push(item);
    }

    // arrays
    let totals: IStatementItem[] = [];
    currentIncome.forEach(item => reduceStatement(item, totals))
    currentSpending.forEach(item => reduceStatement(item, totals))

    let incomes: IStatementItem[] = [];
    currentIncome.forEach(item => reduceStatement(item, incomes))

    let spendings: IStatementItem[] = [];
    currentSpending.forEach(item => reduceStatement(item, spendings))

    return {
      balance: currentBalance.amount,
      total_income: totalIncome,
      total_spending: totalSpending,

      total: totals,
      income: incomes,
      spending: spendings,
    }
  }
}
