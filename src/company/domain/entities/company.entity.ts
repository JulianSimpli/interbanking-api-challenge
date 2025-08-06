import { CompanyId } from '../value-objects/company-id.vo';
import { Cuit } from '../value-objects/cuit.vo';
import { CompanyName } from '../value-objects/company-name.vo';
import { BadRequestException } from '@nestjs/common';
import { now } from '../../../shared/utils/date.utils';
import { CompanyType } from '../../../shared/types/company.types';

export class Company {
  constructor(
    public readonly id: CompanyId,
    public readonly cuit: Cuit,
    public readonly name: CompanyName,
    public readonly adhesionDate: Date,
    public readonly type: CompanyType,
  ) {
    // entity's own validations
    this.validateAdhesionDate();
  }

  static create(
    id: string,
    cuit: string,
    name: string,
    adhesionDate: Date,
    type: CompanyType,
  ): Company {
    return new Company(
      CompanyId.create(id),
      Cuit.create(cuit),
      CompanyName.create(name),
      adhesionDate,
      type,
    );
  }

  private validateAdhesionDate(): void {
    if (this.adhesionDate > now()) {
      throw new BadRequestException('Adhesion date cannot be in the future');
    }
  }
} 