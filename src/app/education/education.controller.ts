import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../utilities/guards/jwt-guard.guard';
import { EducationService } from './education.service';
import { QueryEducationDto, CreateEducationDto, UpdateEducationDto } from './education.dto';
import { ICredential } from '../../interfaces/credential';

@Controller('education')
@UseGuards(JwtAuthGuard)
export class EducationController {

    constructor(private readonly educationService: EducationService) { }

    @Get()
    findAll(@Query() query: QueryEducationDto) {
        return this.educationService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.educationService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateEducationDto, @Req() credential: ICredential) {
        return await this.educationService.create(dto, credential)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateEducationDto, @Req() credential: ICredential) {
        return await this.educationService.update(+id, dto, credential)
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() credential: ICredential) {
        return await this.educationService.delete(+id, credential)
    }

}
