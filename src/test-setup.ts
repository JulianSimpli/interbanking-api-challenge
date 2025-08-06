import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CompanyEntity } from './company/infrastructure/entities/company.entity';
import { TransferEntity } from './transfer/infrastructure/entities/transfer.entity';

import './shared/utils/dayjs.config';

// Global database configuration for tests
export const globalTestDatabaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: ':memory:',
  entities: [CompanyEntity, TransferEntity],
  synchronize: true,
  dropSchema: true,
  extra: {
    foreignKeys: false,
  },
};
