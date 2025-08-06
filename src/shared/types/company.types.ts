export interface ICompany {
  id: string;
  cuit: string;
  name: string;
  adhesionDate: Date;
  type: string;
  createdAt: Date;
  updatedAt: Date;
}

export enum CompanyType {
  PYME = 'PYME',
  CORPORATE = 'CORPORATE',
}

export enum Period {
  LAST_MONTH = 'last_month'
}

export const PERIOD_DAYS: Record<Period, number> = {
  [Period.LAST_MONTH]: 30
};

export interface CompanyFilters {
  adhesionPeriod?: Period;
}

export interface CreateCompanyData {
  id?: string;
  cuit: string;
  name: string;
  adhesionDate: Date;
  type: string;
}
