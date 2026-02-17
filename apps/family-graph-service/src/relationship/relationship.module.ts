import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { CoupleRelationshipEntity } from './entities/couple-relationship.entity';
import { ParentChildEntity } from './entities/parent-child.entity';
import { CoupleService } from './couple.service';
import { ParentChildService } from './parent-child.service';
import { RelationshipController } from './relationship.controller';
import { PersonModule } from '../person/person.module';

@Module({
  imports: [
    TypeOrmModule.forFeature([CoupleRelationshipEntity, ParentChildEntity]),
    PersonModule,
  ],
  controllers: [RelationshipController],
  providers: [CoupleService, ParentChildService],
  exports: [CoupleService, ParentChildService],
})
export class RelationshipModule {}
