import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../utilities/guards/jwt-guard.guard';
import { JobTitleService } from './job-title.service';
import { QueryJobTitleDto, CreateJobTitleDto, UpdateJobTitleDto } from './job-title.dto';
import { ICredential } from '../../interfaces/credential';

@Controller('job-title')
@UseGuards(JwtAuthGuard)
export class JobTitleController {

    constructor(private readonly jobTitleService: JobTitleService) { }

    @Get()
    findAll(@Query() query: QueryJobTitleDto) {
        return this.jobTitleService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.jobTitleService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateJobTitleDto, @Req() credential: ICredential) {
        return await this.jobTitleService.create(dto, credential)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateJobTitleDto, @Req() credential: ICredential) {
        return await this.jobTitleService.update(+id, dto, credential)
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() credential: ICredential) {
        return await this.jobTitleService.delete(+id, credential)
    }

}
