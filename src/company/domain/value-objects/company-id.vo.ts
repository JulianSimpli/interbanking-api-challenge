import { BadRequestException } from '@nestjs/common';

export class CompanyId {
  constructor(private readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new BadRequestException('Company ID cannot be empty');
    }

    if (this.value.length < 3) {
      throw new BadRequestException('Company ID must be at least 3 characters long');
    }
  }

  getValue(): string {
    return this.value;
  }

  static create(value: string): CompanyId {
    return new CompanyId(value);
  }
} 