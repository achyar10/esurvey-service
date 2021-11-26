import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { RespondentController } from './respondent.controller';
import { Respondent } from './respondent.entity';
import { RespondentService } from './respondent.service';

@Module({
  imports: [TypeOrmModule.forFeature([Respondent])],
  exports: [TypeOrmModule],
  controllers: [RespondentController],
  providers: [RespondentService]
})
export class RespondentModule {}
