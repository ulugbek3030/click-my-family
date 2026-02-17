import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { PersonEntity } from '../person/entities/person.entity';
import { CoupleRelationshipEntity } from '../relationship/entities/couple-relationship.entity';
import { ParentChildEntity } from '../relationship/entities/parent-child.entity';
import { TreeService } from './tree.service';
import { TreeController } from './tree.controller';

@Module({
  imports: [
    TypeOrmModule.forFeature([PersonEntity, CoupleRelationshipEntity, ParentChildEntity]),
  ],
  controllers: [TreeController],
  providers: [TreeService],
  exports: [TreeService],
})
export class TreeModule {}
