import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';

import { Transfer } from '../../domain/entities/transfer.entity';
import { TransferRepository } from '../../domain/repositories/transfer.repository.interface';
import { TransferEntity } from '../entities/transfer.entity';
import { TransferMapper } from '../mappers/transfer.mapper';

@Injectable()
export class SqliteTransferRepository implements TransferRepository {
  constructor(
    @InjectRepository(TransferEntity)
    private readonly transferRepository: Repository<TransferEntity>,
  ) { }

  async findAll(): Promise<Transfer[]> {
    const entities = await this.transferRepository.find();
    return entities.map(entity => TransferMapper.toDomain(entity));
  }

  async findById(id: string): Promise<Transfer | null> {
    const entity = await this.transferRepository.findOne({
      where: { id },
    });
    return entity ? TransferMapper.toDomain(entity) : null;
  }

  async save(transfer: Transfer): Promise<Transfer> {
    const entity = TransferMapper.toEntity(transfer);
    const savedEntity = await this.transferRepository.save(entity);
    return TransferMapper.toDomain(savedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.transferRepository.delete(id);
    return result.affected > 0;
  }
}
