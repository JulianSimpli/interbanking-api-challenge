import { TransferId } from '../value-objects/transfer-id.vo';
import { Amount } from '../value-objects/amount.vo';
import { AccountNumber } from '../value-objects/account-number.vo';
import { now } from '../../../shared/utils/date.utils';

export class Transfer {
  constructor(
    public readonly id: TransferId,
    public readonly amount: Amount,
    public readonly companyId: string,
    public readonly debitAccount: AccountNumber,
    public readonly creditAccount: AccountNumber,
    public readonly createdAt: Date,
  ) { }

  static create(
    id: string,
    amount: number,
    companyId: string,
    debitAccount: string,
    creditAccount: string,
    createdAt: Date = now(),
  ): Transfer {
    return new Transfer(
      TransferId.create(id),
      Amount.create(amount),
      companyId,
      AccountNumber.create(debitAccount),
      AccountNumber.create(creditAccount),
      createdAt
    );
  }

  // Domain methods
  isInDateRange(fromDate: Date, toDate: Date): boolean {
    return this.createdAt >= fromDate && this.createdAt <= toDate;
  }
} 