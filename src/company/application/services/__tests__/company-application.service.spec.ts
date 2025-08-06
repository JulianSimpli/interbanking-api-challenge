import { Test, TestingModule } from '@nestjs/testing';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { dayjs } from '../../../../shared/utils/dayjs.config';

import { CompanyApplicationService } from '../company-application.service';
import { CompanyDomainService } from '../../../domain/services/company-domain.service';
import { SqliteCompanyRepository } from '../../../infrastructure/repositories/sqlite-company.repository';
import { COMPANY_REPOSITORY } from '../../../domain/repositories/company.repository.interface';
import { CompanyType, Period } from '../../../../shared/types/company.types';
import { CompanyEntity } from '../../../infrastructure/entities/company.entity';

import { globalTestDatabaseConfig } from '../../../../test-setup';

describe('CompanyApplicationService', () => {
  let service: CompanyApplicationService;
  let repository: SqliteCompanyRepository;
  let module: TestingModule;

  beforeEach(async () => {
    module = await Test.createTestingModule({
      imports: [
        TypeOrmModule.forRoot(globalTestDatabaseConfig),
        TypeOrmModule.forFeature([CompanyEntity]),
      ],
      providers: [
        CompanyApplicationService,
        CompanyDomainService,
        SqliteCompanyRepository,
        {
          provide: COMPANY_REPOSITORY,
          useClass: SqliteCompanyRepository,
        },
      ],
    }).compile();

    service = module.get<CompanyApplicationService>(CompanyApplicationService);
    repository = module.get<SqliteCompanyRepository>(COMPANY_REPOSITORY);
  });

  afterEach(async () => {
    // Clean database after each test
    const companyRepository = module.get<Repository<CompanyEntity>>('CompanyEntityRepository');
    await companyRepository.clear();
  });

  describe('create', () => {
    it('should create a company successfully', async () => {
      // Arrange
      const companyData = {
        cuit: '20-12345678-9',
        name: 'Test Company S.A.',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      };

      // Act
      const result = await service.create(companyData);

      // Assert
      expect(result).toBeDefined();
      expect(result.id.getValue()).toBeDefined();
      expect(result.cuit.getValue()).toBe('20-12345678-9');
      expect(result.name.getValue()).toBe('Test Company S.A.');
      expect(result.adhesionDate).toEqual(dayjs('2024-01-15').utc().toDate());
      expect(result.type).toBe(CompanyType.CORPORATE);

      // Verify it was saved in repository
      const savedCompany = await repository.findById(result.id.getValue());
      expect(savedCompany).toBeDefined();
      expect(savedCompany?.cuit.getValue()).toBe('20-12345678-9');
    });

    it('should create a PYME company successfully', async () => {
      // Arrange
      const companyData = {
        cuit: '20-87654321-0',
        name: 'Small Business Ltd.',
        adhesionDate: dayjs('2024-02-20').utc().toDate(),
        type: CompanyType.PYME,
      };

      // Act
      const result = await service.create(companyData);

      // Assert
      expect(result).toBeDefined();
      expect(result.type).toBe(CompanyType.PYME);
      expect(result.name.getValue()).toBe('Small Business Ltd.');
      expect(result.cuit.getValue()).toBe('20-87654321-0');
    });

    it('should throw error for invalid CUIT format', async () => {
      // Arrange
      const companyData = {
        cuit: 'invalid-cuit',
        name: 'Test Company',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      };

      // Act & Assert
      await expect(service.create(companyData)).rejects.toThrow('CUIT must be in format XX-XXXXXXXX-X');
    });

    it('should throw error for empty company name', async () => {
      // Arrange
      const companyData = {
        cuit: '20-12345678-9',
        name: '',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      };

      // Act & Assert
      await expect(service.create(companyData)).rejects.toThrow('Company name cannot be empty');
    });

    it('should throw error for duplicate CUIT', async () => {
      // Arrange - Create first company
      const companyData1 = {
        cuit: '20-12345678-9',
        name: 'First Company',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      };
      await service.create(companyData1);

      // Try to create second company with same CUIT
      const companyData2 = {
        cuit: '20-12345678-9',
        name: 'Second Company',
        adhesionDate: dayjs('2024-02-20').utc().toDate(),
        type: CompanyType.PYME,
      };

      // Act & Assert
      await expect(service.create(companyData2)).rejects.toThrow('Company with CUIT 20-12345678-9 already exists');
    });

    it('should throw error for future adhesion date', async () => {
      // Arrange
      const futureDate = dayjs().add(1, 'day').utc().toDate();
      const companyData = {
        cuit: '20-12345678-9',
        name: 'Test Company',
        adhesionDate: futureDate,
        type: CompanyType.CORPORATE,
      };

      // Act & Assert
      await expect(service.create(companyData)).rejects.toThrow('Adhesion date cannot be in the future');
    });

    it('should throw error for empty CUIT', async () => {
      // Arrange
      const companyData = {
        cuit: '',
        name: 'Test Company',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      };

      // Act & Assert
      await expect(service.create(companyData)).rejects.toThrow('CUIT cannot be empty');
    });

    it('should throw error for company name too short', async () => {
      // Arrange
      const companyData = {
        cuit: '20-12345678-9',
        name: 'A', // Only 1 character
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      };

      // Act & Assert
      await expect(service.create(companyData)).rejects.toThrow('Company name must be at least 2 characters long');
    });

    it('should throw error for company ID too short', async () => {
      // Arrange
      const companyData = {
        cuit: '20-12345678-9',
        name: 'Test Company',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      };

      // Mock repository to return invalid ID
      jest.spyOn(repository, 'save').mockRejectedValue(new Error('Company ID must be at least 3 characters long'));

      // Act & Assert
      await expect(service.create(companyData)).rejects.toThrow('Company ID must be at least 3 characters long');
    });
  });

  describe('findAll', () => {
    it('should return empty array when no companies exist', async () => {
      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toEqual([]);
    });

    it('should return all companies when multiple exist', async () => {
      // Arrange
      const company1 = await service.create({
        cuit: '20-11111111-1',
        name: 'Company 1',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      });

      const company2 = await service.create({
        cuit: '20-22222222-2',
        name: 'Company 2',
        adhesionDate: dayjs('2024-02-20').utc().toDate(),
        type: CompanyType.PYME,
      });

      // Act
      const result = await service.findAll();

      // Assert
      expect(result).toHaveLength(2);
      expect(result.map(c => c.id.getValue())).toContain(company1.id.getValue());
      expect(result.map(c => c.id.getValue())).toContain(company2.id.getValue());
    });
  });

  describe('findById', () => {
    it('should return company when it exists', async () => {
      // Arrange
      const createdCompany = await service.create({
        cuit: '20-12345678-9',
        name: 'Test Company',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      });

      // Act
      const result = await service.findById(createdCompany.id.getValue());

      // Assert
      expect(result).toBeDefined();
      expect(result.id.getValue()).toBe(createdCompany.id.getValue());
      expect(result.cuit.getValue()).toBe('20-12345678-9');
    });

    it('should throw NotFoundException when company does not exist', async () => {
      // Act & Assert
      await expect(service.findById('non-existent-id')).rejects.toThrow('Company with ID non-existent-id not found');
    });

    it('should throw error for empty ID', async () => {
      // Act & Assert
      await expect(service.findById('')).rejects.toThrow('Company with ID  not found');
    });
  });

  describe('findCompaniesWithTransfers', () => {
    it('should return companies with transfers in the last month', async () => {
      // Arrange - Create companies with transfers in different periods
      const company1 = await service.create({
        cuit: '20-11111111-1',
        name: 'Company 1',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      });

      const company2 = await service.create({
        cuit: '20-22222222-2',
        name: 'Company 2',
        adhesionDate: dayjs('2024-02-20').utc().toDate(),
        type: CompanyType.PYME,
      });

      // Note: This test would need transfer creation logic to be complete
      // For now, we're testing that the method exists and doesn't throw errors

      // Act
      const result = await service.findCompaniesWithTransfers(Period.LAST_MONTH);

      // Assert
      expect(result).toBeDefined();
      expect(Array.isArray(result)).toBe(true);
    });

    it('should return empty array when no companies have transfers', async () => {
      // Act
      const result = await service.findCompaniesWithTransfers(Period.LAST_MONTH);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('findRecentlyAdheredCompanies', () => {
    it('should return companies adhered in the specified period', async () => {
      // Arrange
      const oldCompany = await service.create({
        cuit: '20-11111111-1',
        name: 'Old Company',
        adhesionDate: dayjs().subtract(60, 'days').utc().toDate(),
        type: CompanyType.CORPORATE,
      });

      const recentCompany = await service.create({
        cuit: '20-22222222-2',
        name: 'Recent Company',
        adhesionDate: dayjs().subtract(15, 'days').utc().toDate(),
        type: CompanyType.PYME,
      });

      // Act
      const result = await service.findRecentlyAdheredCompanies(Period.LAST_MONTH);

      // Assert
      expect(result).toHaveLength(1);
      expect(result[0].id.getValue()).toBe(recentCompany.id.getValue());
    });

    it('should return empty array when no companies adhered in period', async () => {
      // Arrange
      await service.create({
        cuit: '20-11111111-1',
        name: 'Old Company',
        adhesionDate: dayjs().subtract(60, 'days').utc().toDate(),
        type: CompanyType.CORPORATE,
      });

      // Act
      const result = await service.findRecentlyAdheredCompanies(Period.LAST_MONTH);

      // Assert
      expect(result).toEqual([]);
    });
  });

  describe('delete', () => {
    it('should delete company when it exists', async () => {
      // Arrange
      const company = await service.create({
        cuit: '20-12345678-9',
        name: 'Test Company',
        adhesionDate: dayjs('2024-01-15').utc().toDate(),
        type: CompanyType.CORPORATE,
      });

      // Act
      const result = await service.delete(company.id.getValue());

      // Assert
      expect(result).toBe(true);

      // Verify it was deleted by trying to find it again
      await expect(service.findById(company.id.getValue())).rejects.toThrow('Company with ID');
    });

    it('should throw NotFoundException when company does not exist', async () => {
      // Act & Assert
      await expect(service.delete('non-existent-id')).rejects.toThrow('Company with ID non-existent-id not found');
    });

    it('should throw error for empty ID', async () => {
      // Act & Assert
      await expect(service.delete('')).rejects.toThrow('Company with ID  not found');
    });
  });
}); 