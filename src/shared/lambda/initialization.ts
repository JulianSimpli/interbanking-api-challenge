import { DataSource } from 'typeorm';

import { CompanyEntity } from '../../company/infrastructure/entities/company.entity';
import { CompanyDomainService } from '../../company/domain/services/company-domain.service';
import { CompanyApplicationService } from '../../company/application/services/company-application.service';
import { SqliteCompanyRepository } from '../../company/infrastructure/repositories/sqlite-company.repository';

// Global variables for Lambda container reuse
let dataSource: DataSource; // One instance of the database connection for all services
let companyApplicationService: CompanyApplicationService;

// Initialize database connection
async function initializeDatabase(): Promise<DataSource> {
  if (!dataSource) {
    dataSource = new DataSource({
      type: 'sqlite',
      database: '/tmp/database.sqlite',
      entities: [
        CompanyEntity,
      ],
      synchronize: true,
      logging: true,
    });

    await dataSource.initialize();
  }

  return dataSource;
}

// Initialize company services
export async function initializeCompanyServices(): Promise<CompanyApplicationService> {
  if (!companyApplicationService) {
    const db = await initializeDatabase();
    const companyRepository = new SqliteCompanyRepository(
      db.getRepository(CompanyEntity)
    );
    const companyDomainService = new CompanyDomainService();
    companyApplicationService = new CompanyApplicationService(
      companyRepository,
      companyDomainService
    );
  }
  return companyApplicationService;
}