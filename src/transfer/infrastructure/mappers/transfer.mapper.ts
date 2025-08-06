import { Transfer } from '../../domain/entities/transfer.entity';
import { TransferResponseDto } from '../dto/transfer-response.dto';
import { TransferEntity } from '../entities/transfer.entity';
import { dayjs } from '../../../shared/utils/dayjs.config';

export class TransferMapper {
  static toResponseDto(transfer: Transfer): TransferResponseDto {
    return {
      id: transfer.id.getValue(),
      amount: transfer.amount.getValue(),
      companyId: transfer.companyId,
      debitAccount: transfer.debitAccount.getValue(),
      creditAccount: transfer.creditAccount.getValue(),
      createdAt: dayjs(transfer.createdAt).utc().toISOString(),
    };
  }

  static toResponseDtoList(transfers: Transfer[]): TransferResponseDto[] {
    return transfers.map(transfer => this.toResponseDto(transfer));
  }

  static toDomain(entity: TransferEntity): Transfer {
    return Transfer.create(
      entity.id,
      entity.amount,
      entity.companyId,
      entity.debitAccount,
      entity.creditAccount,
      entity.createdAt,
    );
  }

  static toEntity(transfer: Transfer): TransferEntity {
    const entity = new TransferEntity();
    entity.id = transfer.id.getValue();
    entity.companyId = transfer.companyId;
    entity.debitAccount = transfer.debitAccount.getValue();
    entity.creditAccount = transfer.creditAccount.getValue();
    entity.amount = transfer.amount.getValue();
    entity.createdAt = transfer.createdAt;
    return entity;
  }
} 