// Transfer-related types
import { ICompany } from './company.types';

export interface ITransfer {
  id: string;
  companyId: string;
  debitAccount: string;
  creditAccount: string;
  amount: number;
  createdAt: Date;
  updatedAt: Date;
  company?: ICompany;
}

export interface CreateTransferData {
  amount: number;
  companyId: string;
  debitAccount: string;
  creditAccount: string;
  createdAt?: Date;
}
