import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../utilities/guards/jwt-guard.guard';
import { QuestionnaireService } from './questionnaire.service';
import { QueryQuestionnaireDto, CreateQuestionnaireDto, UpdateQuestionnaireDto } from './questionnaire.dto';
import { ICredential } from '../../interfaces/credential';

@Controller('questionnaire')
@UseGuards(JwtAuthGuard)
export class QuestionnaireController {

    constructor(private readonly questionCategory: QuestionnaireService) { }

    @Get()
    findAll(@Query() query: QueryQuestionnaireDto) {
        return this.questionCategory.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.questionCategory.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateQuestionnaireDto, @Req() credential: ICredential) {
        return await this.questionCategory.create(dto, credential)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateQuestionnaireDto, @Req() credential: ICredential) {
        return await this.questionCategory.update(+id, dto, credential)
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() credential: ICredential) {
        return await this.questionCategory.delete(+id, credential)
    }

}
