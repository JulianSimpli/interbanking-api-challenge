import { Injectable, Inject, NotFoundException } from '@nestjs/common';
import { randomUUID } from 'crypto';

import { Company } from '../../domain/entities/company.entity';
import { CompanyRepository, COMPANY_REPOSITORY } from '../../domain/repositories/company.repository.interface';
import { CompanyDomainService } from '../../domain/services/company-domain.service';
import { CreateCompanyDto } from '../../infrastructure/dto/create-company.dto';
import { Period } from '../../../shared/types/company.types';
import { now, daysAgo } from '../../../shared/utils/date.utils';

@Injectable()
export class CompanyApplicationService {
  constructor(
    @Inject(COMPANY_REPOSITORY)
    private readonly companyRepository: CompanyRepository,
    private readonly companyDomainService: CompanyDomainService
  ) { }

  async findAll(): Promise<Company[]> {
    return this.companyRepository.findAll();
  }

  async findCompaniesWithTransfers(period: Period): Promise<Company[]> {
    const toDate = now();
    const fromDate = daysAgo(30);

    return this.companyRepository.findCompaniesWithTransfersInPeriod(fromDate, toDate);
  }

  async findRecentlyAdheredCompanies(period: Period): Promise<Company[]> {
    return this.companyRepository.findAll({ adhesionPeriod: period });
  }

  async findById(id: string): Promise<Company> {
    const company = await this.companyRepository.findById(id);
    if (!company) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }
    return company;
  }

  async create(createCompanyDto: CreateCompanyDto): Promise<Company> {
    const id = randomUUID();
    const company = Company.create(
      id,
      createCompanyDto.cuit,
      createCompanyDto.name,
      createCompanyDto.adhesionDate,
      createCompanyDto.type,
    );

    // Validate CUIT uniqueness
    const existingCompany = await this.companyRepository.findByCuit(createCompanyDto.cuit);
    this.companyDomainService.validateCuitUniqueness(existingCompany);

    return this.companyRepository.save(company);
  }

  async delete(id: string): Promise<boolean> {
    const existingCompany = await this.companyRepository.findById(id);
    if (!existingCompany) {
      throw new NotFoundException(`Company with ID ${id} not found`);
    }

    return this.companyRepository.delete(id);
  }

} 