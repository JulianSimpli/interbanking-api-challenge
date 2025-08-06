import { BadRequestException } from '@nestjs/common';

export class Amount {
  constructor(private readonly value: number) {
    this.validate();
  }

  private validate(): void {
    if (this.value <= 0) {
      throw new BadRequestException('Amount must be greater than 0');
    }
  }

  getValue(): number {
    return this.value;
  }

  static create(value: number): Amount {
    return new Amount(value);
  }
} 