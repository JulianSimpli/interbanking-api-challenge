import { BadRequestException } from '@nestjs/common';

export class Cuit {
  constructor(private readonly value: string) {
    this.validate();
  }

  private validate(): void {
    if (!this.value || this.value.trim().length === 0) {
      throw new BadRequestException('CUIT cannot be empty');
    }

    // Validate CUIT format: XX-XXXXXXXX-X
    const cuitRegex = /^\d{2}-\d{8}-\d{1}$/;
    if (!cuitRegex.test(this.value)) {
      throw new BadRequestException('CUIT must be in format XX-XXXXXXXX-X');
    }

    if (!this.isValidCuitFormat()) {
      throw new BadRequestException('Invalid CUIT format');
    }
  }

  getValue(): string {
    return this.value;
  }

  private isValidCuitFormat(): boolean {
    return this.value.length === 13 && this.value.includes('-');
  }

  static create(value: string): Cuit {
    return new Cuit(value);
  }
} 