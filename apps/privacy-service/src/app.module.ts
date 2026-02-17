import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@my-family/database';
import { CachingModule } from '@my-family/caching';
import { PrivacyModule } from './privacy/privacy.module';
import { PrivacySettingsEntity } from './privacy/entities/privacy-settings.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot('privacy', [PrivacySettingsEntity]),
    CachingModule,
    PrivacyModule,
  ],
})
export class AppModule {}
