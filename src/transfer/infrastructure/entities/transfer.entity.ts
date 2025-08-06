import { Entity, PrimaryColumn, Column, ManyToOne, JoinColumn, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ICompany } from '../../../shared/types/company.types';

@Entity('transfers')
export class TransferEntity {
  @PrimaryColumn()
  id: string;

  @Column()
  companyId: string;

  @Column()
  debitAccount: string;

  @Column()
  creditAccount: string;

  @Column({ type: 'decimal', precision: 10, scale: 2 })
  amount: number;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @ManyToOne('CompanyEntity', 'transfers')
  @JoinColumn({ name: 'companyId' })
  company: ICompany;
}
