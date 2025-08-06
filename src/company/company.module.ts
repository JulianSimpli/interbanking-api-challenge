import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CompanyController } from './infrastructure/controllers/company.controller';
import { CompanyApplicationService } from './application/services/company-application.service';
import { CompanyDomainService } from './domain/services/company-domain.service';
import { SqliteCompanyRepository } from './infrastructure/repositories/sqlite-company.repository';
import { COMPANY_REPOSITORY } from './domain/repositories/company.repository.interface';
import { CompanyEntity } from './infrastructure/entities/company.entity';

@Module({
  imports: [TypeOrmModule.forFeature([CompanyEntity])],
  controllers: [CompanyController],
  providers: [
    CompanyApplicationService,
    CompanyDomainService,
    {
      provide: COMPANY_REPOSITORY,
      useClass: SqliteCompanyRepository,
    },
  ],
  exports: [CompanyApplicationService],
})
export class CompanyModule { } 