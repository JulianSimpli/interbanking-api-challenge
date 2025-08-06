import { ApiProperty } from '@nestjs/swagger';

export class TransferResponseDto {
  @ApiProperty({ description: 'Transfer ID' })
  id: string;

  @ApiProperty({ description: 'Transfer amount' })
  amount: number;

  @ApiProperty({ description: 'Company ID' })
  companyId: string;

  @ApiProperty({ description: 'Debit account number' })
  debitAccount: string;

  @ApiProperty({ description: 'Credit account number' })
  creditAccount: string;

  @ApiProperty({ description: 'Creation date in ISO 8601 format (UTC)' })
  createdAt: string;
} 