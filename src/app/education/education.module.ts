import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { EducationController } from './education.controller';
import { Education } from './education.entity';
import { EducationService } from './education.service';

@Module({
  imports: [TypeOrmModule.forFeature([Education])],
  exports: [TypeOrmModule],
  controllers: [EducationController],
  providers: [EducationService]
})
export class EducationModule {}
