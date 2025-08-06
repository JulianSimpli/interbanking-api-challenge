import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';
import { now } from '../../../shared/utils/date.utils';

import { Transfer } from '../../domain/entities/transfer.entity';
import { TransferDomainService } from '../../domain/services/transfer-domain.service';

import { TransferRepository, TRANSFER_REPOSITORY } from '../../domain/repositories/transfer.repository.interface';
import { CompanyRepository, COMPANY_REPOSITORY } from '../../../company/domain/repositories/company.repository.interface';

import { CreateTransferData } from '../../../shared/types/transfer.types';

@Injectable()
export class TransferApplicationService {
  constructor(
    @Inject(TRANSFER_REPOSITORY)
    private readonly transferRepository: TransferRepository,
    private readonly transferDomainService: TransferDomainService,
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository
  ) { }

  async findAll(): Promise<Transfer[]> {
    return this.transferRepository.findAll();
  }

  async findById(id: string): Promise<Transfer> {
    const transfer = await this.transferRepository.findById(id);
    if (!transfer) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }
    return transfer;
  }

  async create(transferData: CreateTransferData): Promise<Transfer> {
    const company = await this.companyRepository.findById(transferData.companyId);
    if (!company) {
      throw new NotFoundException(`Company with ID ${transferData.companyId} not found`);
    }

    const id = randomUUID();
    const createdAt = transferData.createdAt || now();

    const transfer = Transfer.create(
      id,
      transferData.amount,
      transferData.companyId,
      transferData.debitAccount,
      transferData.creditAccount,
      createdAt,
    );

    this.transferDomainService.validateTransfer(transfer);

    return this.transferRepository.save(transfer);
  }

  async delete(id: string): Promise<boolean> {
    const existingTransfer = await this.transferRepository.findById(id);
    if (!existingTransfer) {
      throw new NotFoundException(`Transfer with ID ${id} not found`);
    }

    return this.transferRepository.delete(id);
  }
} 