import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { TransferApplicationService } from './application/services/transfer-application.service';
import { TransferDomainService } from './domain/services/transfer-domain.service';
import { TransferController } from './infrastructure/controllers/transfer.controller';
import { SqliteTransferRepository } from './infrastructure/repositories/sqlite-transfer.repository';
import { TRANSFER_REPOSITORY } from './domain/repositories/transfer.repository.interface';
import { TransferEntity } from './infrastructure/entities/transfer.entity';
import { CompanyEntity } from '../company/infrastructure/entities/company.entity';
import { SqliteCompanyRepository } from '../company/infrastructure/repositories/sqlite-company.repository';
import { COMPANY_REPOSITORY } from '../company/domain/repositories/company.repository.interface';

@Module({
  imports: [
    TypeOrmModule.forFeature([TransferEntity, CompanyEntity]),
  ],
  controllers: [TransferController],
  providers: [
    TransferApplicationService,
    TransferDomainService,
    {
      provide: TRANSFER_REPOSITORY,
      useClass: SqliteTransferRepository,
    },
    {
      provide: COMPANY_REPOSITORY,
      useClass: SqliteCompanyRepository,
    },
  ],
  exports: [TransferApplicationService],
})
export class TransferModule { } 