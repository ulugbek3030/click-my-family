import { IsBoolean, IsOptional } from 'class-validator';

export class UpdatePrivacySettingsDto {
  @IsOptional()
  @IsBoolean()
  sharePhoto?: boolean;

  @IsOptional()
  @IsBoolean()
  sharePhone?: boolean;

  @IsOptional()
  @IsBoolean()
  shareAddress?: boolean;

  @IsOptional()
  @IsBoolean()
  shareSocial?: boolean;

  @IsOptional()
  @IsBoolean()
  shareNotes?: boolean;

  @IsOptional()
  @IsBoolean()
  shareBirthDate?: boolean;
}

export class PrivacySettingsResponseDto {
  id: string;
  personId: string;
  ownerUserId: string;
  sharePhoto: boolean;
  sharePhone: boolean;
  shareAddress: boolean;
  shareSocial: boolean;
  shareNotes: boolean;
  shareBirthDate: boolean;
}
