import { Company } from '../../domain/entities/company.entity';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CompanyEntity } from '../entities/company.entity';
import { CompanyType } from '../../../shared/types/company.types';

export class CompanyMapper {
  static toResponseDto(company: Company): CompanyResponseDto {
    return {
      id: company.id.getValue(),
      cuit: company.cuit.getValue(),
      name: company.name.getValue(),
      adhesionDate: company.adhesionDate,
      type: company.type,
    };
  }

  static toResponseDtoList(companies: Company[]): CompanyResponseDto[] {
    return companies.map(company => this.toResponseDto(company));
  }

  static toDomain(entity: CompanyEntity): Company {
    return Company.create(
      entity.id,
      entity.cuit,
      entity.name,
      entity.adhesionDate,
      entity.type as CompanyType,
    );
  }

  static toEntity(company: Company): CompanyEntity {
    const entity = new CompanyEntity();
    entity.id = company.id.getValue();
    entity.cuit = company.cuit.getValue();
    entity.name = company.name.getValue();
    entity.adhesionDate = company.adhesionDate;
    entity.type = company.type;
    return entity;
  }
} 