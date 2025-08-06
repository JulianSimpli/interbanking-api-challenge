import { Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, Between, FindOptionsWhere } from 'typeorm';

import { Company } from '../../domain/entities/company.entity';
import { CompanyRepository } from '../../domain/repositories/company.repository.interface';
import { CompanyEntity } from '../entities/company.entity';
import { CompanyMapper } from '../mappers/company.mapper';

import { now, daysAgo } from '../../../shared/utils/date.utils';
import { CompanyFilters, PERIOD_DAYS } from '../../../shared/types/company.types';

@Injectable()
export class SqliteCompanyRepository implements CompanyRepository {
  constructor(
    @InjectRepository(CompanyEntity)
    private readonly companyRepository: Repository<CompanyEntity>,
  ) { }

  async findAll(filters?: CompanyFilters): Promise<Company[]> {
    const whereConditions: FindOptionsWhere<CompanyEntity> = {};

    // Apply period filter (adhesion date range)
    if (filters?.adhesionPeriod) {
      const days = PERIOD_DAYS[filters.adhesionPeriod];
      if (days !== undefined) {
        const toDate = now();
        const fromDate = daysAgo(days);
        whereConditions.adhesionDate = Between(fromDate, toDate);
      }
    }

    const entities = await this.companyRepository.find({
      where: Object.keys(whereConditions).length > 0 ? whereConditions : undefined,
    });

    return entities.map(entity => CompanyMapper.toDomain(entity));
  }

  async findById(id: string): Promise<Company | null> {
    const entity = await this.companyRepository.findOne({ where: { id } });
    return entity ? CompanyMapper.toDomain(entity) : null;
  }

  async findByCuit(cuit: string): Promise<Company | null> {
    const entity = await this.companyRepository.findOne({ where: { cuit } });
    return entity ? CompanyMapper.toDomain(entity) : null;
  }

  async findCompaniesWithTransfersInPeriod(fromDate: Date, toDate: Date): Promise<Company[]> {
    // Optimized query using JOIN to get companies with transfers in the period
    const entities = await this.companyRepository
      .createQueryBuilder('company')
      .distinct()
      .innerJoin('company.transfers', 'transfer')
      .where('transfer.createdAt BETWEEN :fromDate AND :toDate', {
        fromDate,
        toDate,
      })
      .getMany();

    return entities.map(entity => CompanyMapper.toDomain(entity));
  }

  async save(company: Company): Promise<Company> {
    const entity = CompanyMapper.toEntity(company);
    const savedEntity = await this.companyRepository.save(entity);
    return CompanyMapper.toDomain(savedEntity);
  }

  async delete(id: string): Promise<boolean> {
    const result = await this.companyRepository.delete(id);
    return result.affected > 0;
  }
}
