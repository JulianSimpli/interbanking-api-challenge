import { ConflictException } from '@nestjs/common';

import { Company } from '../entities/company.entity';

export class CompanyDomainService {
  // business rules validations
  validateCuitUniqueness(existingCompany: Company | null): boolean {
    if (existingCompany) {
      throw new ConflictException(`Company with CUIT ${existingCompany.cuit.getValue()} already exists`);
    }
    return true;
  }
} 