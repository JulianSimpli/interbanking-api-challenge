import { ApiProperty } from '@nestjs/swagger';
import { CompanyType } from '../../../shared/types/company.types';

export class CompanyResponseDto {
  @ApiProperty({ description: 'Company ID' })
  id: string;

  @ApiProperty({ description: 'Company CUIT' })
  cuit: string;

  @ApiProperty({ description: 'Company name' })
  name: string;

  @ApiProperty({ description: 'Adhesion date' })
  adhesionDate: Date;

  @ApiProperty({ enum: CompanyType, description: 'Company type' })
  type: CompanyType;
} 