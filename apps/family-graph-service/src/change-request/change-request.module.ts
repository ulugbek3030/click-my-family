import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ChangeRequestEntity } from './entities/change-request.entity';
import { ChangeRequestService } from './change-request.service';
import { ChangeRequestController } from './change-request.controller';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [TypeOrmModule.forFeature([ChangeRequestEntity]), PersonModule],
  controllers: [ChangeRequestController],
  providers: [ChangeRequestService],
  exports: [ChangeRequestService],
})
export class ChangeRequestModule {}
