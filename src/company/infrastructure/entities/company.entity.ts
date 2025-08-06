import { Entity, PrimaryColumn, Column, OneToMany, CreateDateColumn, UpdateDateColumn } from 'typeorm';
import { ITransfer } from '../../../shared/types/transfer.types';

@Entity('companies')
export class CompanyEntity {
  @PrimaryColumn()
  id: string;

  @Column({ unique: true })
  cuit: string;

  @Column()
  name: string;

  @Column({ type: 'datetime' })
  adhesionDate: Date;

  @Column()
  type: string;

  @CreateDateColumn()
  createdAt: Date;

  @UpdateDateColumn()
  updatedAt: Date;

  @OneToMany('TransferEntity', 'company')
  transfers: ITransfer[];
}
