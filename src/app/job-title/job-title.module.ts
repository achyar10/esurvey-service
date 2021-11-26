import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobTitleController } from './job-title.controller';
import { JobTitle } from './job-title.entity';
import { JobTitleService } from './job-title.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobTitle])],
  exports: [TypeOrmModule],
  controllers: [JobTitleController],
  providers: [JobTitleService]
})
export class JobTitleModule {}
