import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../utilities/guards/jwt-guard.guard';
import { JobStatusService } from './job-status.service';
import { QueryJobStatusDto, CreateJobStatusDto, UpdateJobStatusDto } from './job-status.dto';
import { ICredential } from '../../interfaces/credential';

@Controller('job-status')
@UseGuards(JwtAuthGuard)
export class JobStatusController {

    constructor(private readonly jobStatusService: JobStatusService) { }

    @Get()
    findAll(@Query() query: QueryJobStatusDto) {
        return this.jobStatusService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.jobStatusService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateJobStatusDto, @Req() credential: ICredential) {
        return await this.jobStatusService.create(dto, credential)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateJobStatusDto, @Req() credential: ICredential) {
        return await this.jobStatusService.update(+id, dto, credential)
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() credential: ICredential) {
        return await this.jobStatusService.delete(+id, credential)
    }

}
