import { DateTime } from 'luxon'
import Statement from 'App/Models/Statement';

export interface IStatementItem {
  date: DateTime;
  list: Statement[];
}

export default interface IListStatement {
  balance: number;
  total_spending: number;
  total_income: number;

  total: IStatementItem[];
  income: IStatementItem[];
  spending: IStatementItem[];
}
