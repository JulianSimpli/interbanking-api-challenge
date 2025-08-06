import { TypeOrmModuleOptions } from '@nestjs/typeorm';
import { CompanyEntity } from '../company/infrastructure/entities/company.entity';
import { TransferEntity } from '../transfer/infrastructure/entities/transfer.entity';

export const databaseConfig: TypeOrmModuleOptions = {
  type: 'sqlite',
  database: 'database.sqlite',
  entities: [CompanyEntity, TransferEntity],
  synchronize: true,
};
