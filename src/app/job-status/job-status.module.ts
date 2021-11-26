import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { JobStatusController } from './job-status.controller';
import { JobStatus } from './job-status.entity';
import { JobStatusService } from './job-status.service';

@Module({
  imports: [TypeOrmModule.forFeature([JobStatus])],
  exports: [TypeOrmModule],
  controllers: [JobStatusController],
  providers: [JobStatusService]
})
export class JobStatusModule {}
