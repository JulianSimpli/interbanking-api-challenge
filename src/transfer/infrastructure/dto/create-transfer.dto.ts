import { ApiProperty } from '@nestjs/swagger';
import { IsNumber, IsString, IsOptional, IsDateString, Min } from 'class-validator';

export class CreateTransferDto {
  @ApiProperty({ description: 'Transfer amount', example: 1000.50 })
  @IsNumber()
  @Min(0.01)
  amount: number;

  @ApiProperty({ description: 'Company ID', example: 'company-123' })
  @IsString()
  companyId: string;

  @ApiProperty({ description: 'Debit account number', example: '1234567890' })
  @IsString()
  debitAccount: string;

  @ApiProperty({ description: 'Credit account number', example: '0987654321' })
  @IsString()
  creditAccount: string;

  @ApiProperty({ description: 'Creation date in ISO 8601 format (UTC) (optional)', example: '2024-01-15T10:30:00Z', required: false })
  @IsOptional()
  @IsDateString()
  createdAt?: string;
} 