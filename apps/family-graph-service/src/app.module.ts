import { Module } from '@nestjs/common';
import { ConfigModule } from '@nestjs/config';
import { ScheduleModule } from '@nestjs/schedule';
import { DatabaseModule } from '@my-family/database';
import { MessagingModule } from '@my-family/messaging';
import { CachingModule } from '@my-family/caching';
import { AuditModule } from '@my-family/audit';
import { PersonModule } from './person/person.module';
import { RelationshipModule } from './relationship/relationship.module';
import { TreeModule } from './tree/tree.module';
import { ChangeRequestModule } from './change-request/change-request.module';
import { MapModule } from './map/map.module';
import { ArchiveModule } from './archive/archive.module';
import { PersonEntity } from './person/entities/person.entity';
import { CoupleRelationshipEntity } from './relationship/entities/couple-relationship.entity';
import { ParentChildEntity } from './relationship/entities/parent-child.entity';
import { ChangeRequestEntity } from './change-request/entities/change-request.entity';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    ScheduleModule.forRoot(),
    DatabaseModule.forRoot('family_graph', [
      PersonEntity,
      CoupleRelationshipEntity,
      ParentChildEntity,
      ChangeRequestEntity,
    ]),
    MessagingModule.forRoot({ serviceName: 'family-graph-service' }),
    CachingModule,
    AuditModule,
    PersonModule,
    RelationshipModule,
    TreeModule,
    ChangeRequestModule,
    MapModule,
    ArchiveModule,
  ],
})
export class AppModule {}
