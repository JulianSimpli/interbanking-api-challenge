import { Transfer } from '../entities/transfer.entity';

export const TRANSFER_REPOSITORY = 'TRANSFER_REPOSITORY';

export interface TransferRepository {
  findAll(): Promise<Transfer[]>;
  findById(id: string): Promise<Transfer | null>;
  save(transfer: Transfer): Promise<Transfer>;
  delete(id: string): Promise<boolean>;
} 