import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam } from '@nestjs/swagger';
import { dayjs } from '../../../shared/utils/dayjs.config';
import { TransferApplicationService } from '../../application/services/transfer-application.service';
import { CreateTransferDto } from '../dto/create-transfer.dto';
import { TransferResponseDto } from '../dto/transfer-response.dto';
import { TransferMapper } from '../mappers/transfer.mapper';

@ApiTags('transfers')
@Controller('transfers')
export class TransferController {
  constructor(private readonly transferApplicationService: TransferApplicationService) { }

  @Get()
  @ApiOperation({ summary: 'Get all transfers' })
  @ApiResponse({ status: 200, description: 'List of transfers retrieved successfully', type: [TransferResponseDto] })
  async findAll(): Promise<TransferResponseDto[]> {
    const transfers = await this.transferApplicationService.findAll();
    return TransferMapper.toResponseDtoList(transfers);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get transfer by ID' })
  @ApiParam({ name: 'id', description: 'Transfer ID' })
  @ApiResponse({ status: 200, description: 'Transfer found successfully', type: TransferResponseDto })
  async findById(@Param('id') id: string): Promise<TransferResponseDto> {
    const transfer = await this.transferApplicationService.findById(id);
    return TransferMapper.toResponseDto(transfer);
  }

  @Post()
  @ApiOperation({ summary: 'Create new transfer' })
  @ApiResponse({ status: 201, description: 'Transfer created successfully', type: TransferResponseDto })
  async create(@Body() createTransferDto: CreateTransferDto): Promise<TransferResponseDto> {
    const transferData = {
      amount: createTransferDto.amount,
      companyId: createTransferDto.companyId,
      debitAccount: createTransferDto.debitAccount,
      creditAccount: createTransferDto.creditAccount,
      createdAt: createTransferDto.createdAt ? dayjs(createTransferDto.createdAt).utc().toDate() : undefined,
    };
    const transfer = await this.transferApplicationService.create(transferData);
    return TransferMapper.toResponseDto(transfer);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete transfer' })
  @ApiParam({ name: 'id', description: 'Transfer ID' })
  @ApiResponse({ status: 204, description: 'Transfer deleted successfully' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.transferApplicationService.delete(id);
  }
} 