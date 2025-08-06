import { Transfer } from '../entities/transfer.entity';
import { BadRequestException } from '@nestjs/common';
import { now } from '../../../shared/utils/date.utils';

export class TransferDomainService {
  validateTransfer(transfer: Transfer): boolean {
    if (transfer.amount.getValue() <= 0) {
      throw new BadRequestException('Transfer amount must be greater than 0');
    }

    if (transfer.createdAt > now()) {
      throw new BadRequestException('Transfer date cannot be in the future');
    }

    return true;
  }
} 