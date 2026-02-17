import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PrivacySettingsEntity } from './entities/privacy-settings.entity';
import { PrivacyService } from './privacy.service';
import { PrivacyFilterService } from './privacy-filter.service';
import { PrivacyController } from './privacy.controller';

@Module({
  imports: [TypeOrmModule.forFeature([PrivacySettingsEntity])],
  providers: [PrivacyService, PrivacyFilterService],
  controllers: [PrivacyController],
})
export class PrivacyModule {}
