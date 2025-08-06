import { BadRequestException } from '@nestjs/common';

export class AccountNumber {
  constructor(private readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new BadRequestException('Account number cannot be empty');
    }

    if (this.value.length < 8) {
      throw new BadRequestException('Account number must be at least 8 characters long');
    }

    if (this.value.length > 20) {
      throw new BadRequestException('Account number cannot exceed 20 characters');
    }

    // Validate format: only numbers and hyphens allowed
    const accountRegex = /^[0-9-]+$/;
    if (!accountRegex.test(this.value)) {
      throw new BadRequestException('Account number can only contain numbers and hyphens');
    }
  }

  getValue(): string {
    return this.value;
  }

  static create(value: string): AccountNumber {
    return new AccountNumber(value);
  }
} 