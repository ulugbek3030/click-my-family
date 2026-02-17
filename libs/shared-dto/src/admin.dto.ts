import {
  IsString,
  IsOptional,
  IsDateString,
  IsBoolean,
  IsEnum,
  IsArray,
  IsNumber,
  IsObject,
  MaxLength,
} from 'class-validator';

export enum TargetAudience {
  ALL = 'all',
  MALE = 'male',
  FEMALE = 'female',
  PREMIUM = 'premium',
  CUSTOM = 'custom',
}

export class CreateHolidayDto {
  @IsString()
  @MaxLength(200)
  titleUz: string;

  @IsString()
  @MaxLength(200)
  titleRu: string;

  @IsOptional()
  @IsString()
  descriptionUz?: string;

  @IsOptional()
  @IsString()
  descriptionRu?: string;

  @IsDateString()
  holidayDate: string;

  @IsOptional()
  @IsBoolean()
  isRecurring?: boolean = true;

  @IsOptional()
  @IsString()
  iconUrl?: string;

  @IsOptional()
  @IsString()
  bannerUrl?: string;

  @IsOptional()
  @IsEnum(TargetAudience)
  targetAudience?: TargetAudience = TargetAudience.ALL;

  @IsOptional()
  @IsObject()
  targetCriteria?: Record<string, unknown>;

  @IsOptional()
  @IsArray()
  @IsNumber({}, { each: true })
  notifyDaysBefore?: number[] = [7, 1, 0];

  @IsOptional()
  @IsString()
  notificationTitleUz?: string;

  @IsOptional()
  @IsString()
  notificationTitleRu?: string;

  @IsOptional()
  @IsString()
  notificationBodyUz?: string;

  @IsOptional()
  @IsString()
  notificationBodyRu?: string;

  @IsOptional()
  @IsString()
  ctaAction?: string;

  @IsOptional()
  @IsObject()
  ctaPayload?: Record<string, unknown>;
}

export class CreateCardTemplateDto {
  @IsString()
  @MaxLength(200)
  titleUz: string;

  @IsString()
  @MaxLength(200)
  titleRu: string;

  @IsString()
  imageUrl: string;

  @IsOptional()
  @IsString()
  animationUrl?: string;

  @IsString()
  priceType: string;

  @IsOptional()
  @IsNumber()
  priceAmount?: number = 0;

  @IsOptional()
  @IsString()
  category?: string;

  @IsOptional()
  @IsNumber()
  displayOrder?: number = 0;
}
