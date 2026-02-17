import { IsUUID, IsString, IsNumber, IsPositive } from 'class-validator';

export class SelectTransferRelativeDto {
  @IsUUID()
  personId: string;
}

export class ExecuteTransferDto {
  @IsNumber()
  @IsPositive()
  amount: number; // in tiyin

  @IsString()
  receiverUserId: string;
}

export class TransferSelectionResponseDto {
  id: string;
  userId: string;
  selectedPersonId: string;
  selectedUserId: string;
  isActive: boolean;
  selectedAt: string;
  changeableAfter: string;
}

export class TransferEligibilityResponseDto {
  isEligible: boolean;
  reason?: string;
  currentLevel: number;
  requiredLevel: number;
  selectedRelative?: TransferSelectionResponseDto;
  transferLimit: number;
}

export class TransferLogResponseDto {
  id: string;
  senderUserId: string;
  receiverUserId: string;
  amount: number;
  currency: string;
  status: string;
  createdAt: string;
  completedAt?: string;
}
