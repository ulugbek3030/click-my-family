import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { DatabaseModule } from '@my-family/database';
import { MessagingModule } from '@my-family/messaging';
import { CachingModule } from '@my-family/caching';
import { HolidayModule } from './holiday/holiday.module';
import { AuthModule } from './auth/auth.module';
import { HolidayEntity } from './holiday/entities/holiday.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    DatabaseModule.forRoot('admin', [HolidayEntity]),
    MessagingModule.forRoot({ serviceName: 'admin-service' }),
    CachingModule,
    AuthModule,
    HolidayModule,
  ],
})
export class AppModule {}
