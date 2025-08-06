import {
  Controller,
  Get,
  Post,
  Delete,
  Body,
  Param,
  Query,
} from '@nestjs/common';
import { ApiTags, ApiOperation, ApiResponse, ApiParam, ApiQuery } from '@nestjs/swagger';

import { CompanyApplicationService } from '../../application/services/company-application.service';
import { CreateCompanyDto } from '../dto/create-company.dto';
import { CompanyResponseDto } from '../dto/company-response.dto';
import { CompanyMapper } from '../mappers/company.mapper';
import { Period } from '../../../shared/types/company.types';

@ApiTags('companies')
@Controller('companies')
export class CompanyController {
  constructor(private readonly companyApplicationService: CompanyApplicationService) { }

  @Get()
  @ApiOperation({ summary: 'Get all companies' })
  @ApiResponse({ status: 200, description: 'List of companies retrieved successfully', type: [CompanyResponseDto] })
  async findAll(): Promise<CompanyResponseDto[]> {
    const companies = await this.companyApplicationService.findAll();
    return CompanyMapper.toResponseDtoList(companies);
  }

  @Get('transfers')
  @ApiOperation({ summary: 'Get companies that made transfers in a specific period' })
  @ApiQuery({ name: 'period', description: 'Time period', enum: Period, example: Period.LAST_MONTH, required: true })
  @ApiResponse({ status: 200, description: 'Companies with transfers retrieved successfully', type: [CompanyResponseDto] })
  async getCompaniesWithTransfers(@Query('period') period: Period = Period.LAST_MONTH): Promise<CompanyResponseDto[]> {
    const companies = await this.companyApplicationService.findCompaniesWithTransfers(period);
    return CompanyMapper.toResponseDtoList(companies);
  }

  @Get('adhesions')
  @ApiOperation({ summary: 'Get companies that adhered recently in a specific period' })
  @ApiQuery({ name: 'period', description: 'Time period', enum: Period, example: Period.LAST_MONTH, required: true })
  @ApiResponse({ status: 200, description: 'Recently adhered companies retrieved successfully', type: [CompanyResponseDto] })
  async getRecentlyAdheredCompanies(@Query('period') period: Period = Period.LAST_MONTH): Promise<CompanyResponseDto[]> {
    const companies = await this.companyApplicationService.findRecentlyAdheredCompanies(period);
    return CompanyMapper.toResponseDtoList(companies);
  }

  @Get(':id')
  @ApiOperation({ summary: 'Get company by ID' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 200, description: 'Company found successfully', type: CompanyResponseDto })
  async findById(@Param('id') id: string): Promise<CompanyResponseDto> {
    const company = await this.companyApplicationService.findById(id);
    return CompanyMapper.toResponseDto(company);
  }

  @Post()
  @ApiOperation({ summary: 'Create new company' })
  @ApiResponse({ status: 201, description: 'Company created successfully', type: CompanyResponseDto })
  async create(@Body() createCompanyDto: CreateCompanyDto): Promise<CompanyResponseDto> {
    const company = await this.companyApplicationService.create(createCompanyDto);
    return CompanyMapper.toResponseDto(company);
  }

  @Delete(':id')
  @ApiOperation({ summary: 'Delete company' })
  @ApiParam({ name: 'id', description: 'Company ID' })
  @ApiResponse({ status: 204, description: 'Company deleted successfully' })
  async delete(@Param('id') id: string): Promise<void> {
    await this.companyApplicationService.delete(id);
  }
} 