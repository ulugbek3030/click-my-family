import { IsString, IsOptional, IsEnum, IsDateString, IsUUID } from 'class-validator';
import { DatePrecision } from './person.dto';

export enum CoupleRelationshipType {
  COUPLE = 'couple',
  CIVIL_UNION = 'civil_union',
  MARRIED = 'married',
  DIVORCED = 'divorced',
  WIDOWED = 'widowed',
}

export enum ParentChildRelationType {
  BIOLOGICAL = 'biological',
  ADOPTION = 'adoption',
  GUARDIANSHIP = 'guardianship',
  FOSTER = 'foster',
}

export class CreateCoupleRelationshipDto {
  @IsUUID()
  personAId: string;

  @IsUUID()
  personBId: string;

  @IsEnum(CoupleRelationshipType)
  relationshipType: CoupleRelationshipType;

  @IsOptional()
  @IsDateString()
  startDate?: string;

  @IsOptional()
  @IsEnum(DatePrecision)
  startDatePrecision?: DatePrecision = DatePrecision.UNKNOWN;

  @IsOptional()
  @IsDateString()
  endDate?: string;

  @IsOptional()
  @IsEnum(DatePrecision)
  endDatePrecision?: DatePrecision = DatePrecision.UNKNOWN;

  @IsOptional()
  @IsString()
  marriagePlace?: string;
}

export class CreateParentChildDto {
  @IsUUID()
  parentId: string;

  @IsUUID()
  childId: string;

  @IsEnum(ParentChildRelationType)
  relationshipType: ParentChildRelationType;
}

export class CreateChangeRequestDto {
  @IsUUID()
  targetPersonId: string;

  @IsString()
  treeOwnerUserId: string;

  proposedChanges: Record<string, unknown>;
}

export enum ChangeRequestStatus {
  PENDING = 'pending',
  APPROVED = 'approved',
  REJECTED = 'rejected',
  EXPIRED = 'expired',
}
