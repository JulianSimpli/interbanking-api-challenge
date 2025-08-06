import { Company } from '../entities/company.entity';
import { CompanyFilters } from '../../../shared/types/company.types';

export const COMPANY_REPOSITORY = 'COMPANY_REPOSITORY';

export interface CompanyRepository {
  findAll(filters?: CompanyFilters): Promise<Company[]>;
  findById(id: string): Promise<Company | null>;
  findByCuit(cuit: string): Promise<Company | null>;
  findCompaniesWithTransfersInPeriod(fromDate: Date, toDate: Date): Promise<Company[]>;
  save(company: Company): Promise<Company>;
  delete(id: string): Promise<boolean>;
} 