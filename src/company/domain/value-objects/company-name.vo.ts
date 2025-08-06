import { BadRequestException } from '@nestjs/common';

export class CompanyName {
  constructor(private readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new BadRequestException('Company name cannot be empty');
    }

    if (this.value.trim().length < 2) {
      throw new BadRequestException('Company name must be at least 2 characters long');
    }

    if (this.value.length > 100) {
      throw new BadRequestException('Company name cannot exceed 100 characters');
    }
  }

  getValue(): string {
    return this.value;
  }

  static create(value: string): CompanyName {
    return new CompanyName(value);
  }
} 