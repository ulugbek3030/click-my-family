import {
  IsString,
  IsOptional,
  IsEnum,
  IsDateString,
  IsBoolean,
  IsNumber,
  IsPhoneNumber,
  MaxLength,
  IsObject,
} from 'class-validator';

export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
}

export enum DatePrecision {
  FULL = 'full',
  YEAR_ONLY = 'year_only',
  UNKNOWN = 'unknown',
}

export class CreatePersonDto {
  @IsString()
  @MaxLength(100)
  firstName: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  middleName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  maidenName?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(DatePrecision)
  birthDatePrecision?: DatePrecision = DatePrecision.UNKNOWN;

  @IsOptional()
  @IsBoolean()
  isAlive?: boolean = true;

  @IsOptional()
  @IsDateString()
  deathDate?: string;

  @IsOptional()
  @IsEnum(DatePrecision)
  deathDatePrecision?: DatePrecision = DatePrecision.UNKNOWN;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  addressText?: string;

  @IsOptional()
  @IsNumber()
  addressLat?: number;

  @IsOptional()
  @IsNumber()
  addressLng?: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class UpdatePersonDto {
  @IsOptional()
  @IsString()
  @MaxLength(100)
  firstName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  lastName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  middleName?: string;

  @IsOptional()
  @IsString()
  @MaxLength(100)
  maidenName?: string;

  @IsOptional()
  @IsEnum(Gender)
  gender?: Gender;

  @IsOptional()
  @IsDateString()
  birthDate?: string;

  @IsOptional()
  @IsEnum(DatePrecision)
  birthDatePrecision?: DatePrecision;

  @IsOptional()
  @IsBoolean()
  isAlive?: boolean;

  @IsOptional()
  @IsDateString()
  deathDate?: string;

  @IsOptional()
  @IsEnum(DatePrecision)
  deathDatePrecision?: DatePrecision;

  @IsOptional()
  @IsString()
  phone?: string;

  @IsOptional()
  @IsString()
  addressText?: string;

  @IsOptional()
  @IsNumber()
  addressLat?: number;

  @IsOptional()
  @IsNumber()
  addressLng?: number;

  @IsOptional()
  @IsString()
  photoUrl?: string;

  @IsOptional()
  @IsObject()
  socialLinks?: Record<string, string>;

  @IsOptional()
  @IsString()
  notes?: string;
}

export class PersonResponseDto {
  id: string;
  ownerUserId: string;
  linkedUserId?: string;
  firstName: string;
  lastName?: string;
  middleName?: string;
  maidenName?: string;
  gender?: Gender;
  birthDate?: string;
  birthDatePrecision?: DatePrecision;
  isAlive: boolean;
  deathDate?: string;
  phone?: string;
  addressText?: string;
  addressLat?: number;
  addressLng?: number;
  photoUrl?: string;
  socialLinks?: Record<string, string>;
  notes?: string;
  isConfirmed: boolean;
  confirmedAt?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
