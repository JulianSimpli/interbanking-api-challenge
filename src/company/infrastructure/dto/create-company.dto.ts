import { IsString, IsNotEmpty, IsEnum, IsDateString, Matches, Length } from 'class-validator';
import { ApiProperty } from '@nestjs/swagger';
import { CompanyType } from '../../../shared/types/company.types';
import { ToDate } from '../../../shared/decorators/date-transform.decorator';

export class CreateCompanyDto {
  @ApiProperty({
    description: 'Company CUIT (must be unique, format: XX-XXXXXXXX-X)',
    example: '20-12345678-9'
  })
  @IsString()
  @IsNotEmpty()
  @Matches(/^\d{2}-\d{8}-\d$/, {
    message: 'CUIT must be in format XX-XXXXXXXX-X'
  })
  cuit: string;

  @ApiProperty({
    description: 'Company name (3-100 characters)',
    example: 'Example Company S.A.'
  })
  @IsString()
  @IsNotEmpty()
  @Length(3, 100, {
    message: 'Company name must be between 3 and 100 characters'
  })
  name: string;

  @ApiProperty({
    description: 'Company adhesion date (ISO 8601 format)',
    example: '2024-01-15T00:00:00.000Z'
  })
  @IsDateString()
  @ToDate()
  adhesionDate: Date;

  @ApiProperty({
    description: 'Company type',
    enum: CompanyType,
    example: CompanyType.CORPORATE
  })
  @IsEnum(CompanyType)
  type: CompanyType;
} 