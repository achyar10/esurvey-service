import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../utilities/guards/jwt-guard.guard';
import { RespondentService } from './respondent.service';
import { QueryRespondentDto, CreateRespondentDto, UpdateRespondentDto } from './respondent.dto';
import { ICredential } from '../../interfaces/credential';

@Controller('respondent')
@UseGuards(JwtAuthGuard)
export class RespondentController {

    constructor(private readonly respondentService: RespondentService) { }

    @Get()
    findAll(@Query() query: QueryRespondentDto) {
        return this.respondentService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.respondentService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateRespondentDto, @Req() credential: ICredential) {
        return await this.respondentService.create(dto, credential)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: any, @Req() credential: ICredential) {
        return await this.respondentService.update(+id, dto, credential)
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() credential: ICredential) {
        return await this.respondentService.delete(+id, credential)
    }

}
