import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../utilities/guards/jwt-guard.guard';
import { QuestionnaireRespondentService } from './questionnaire-respondent.service';
import { QueryQuestionnaireRespondentDto, CreateQuestionnaireRespondentDto, UpdateQuestionnaireRespondentDto } from './questionnaire-respondent.dto';
import { ICredential } from '../../interfaces/credential';

@Controller('questionnaire-respondent')
@UseGuards(JwtAuthGuard)
export class QuestionnaireRespondentController {

    constructor(private readonly questionCategory: QuestionnaireRespondentService) { }

    @Get()
    findAll(@Query() query: QueryQuestionnaireRespondentDto) {
        return this.questionCategory.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.questionCategory.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateQuestionnaireRespondentDto) {
        return await this.questionCategory.create(dto)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateQuestionnaireRespondentDto, @Req() credential: ICredential) {
        return await this.questionCategory.update(+id, dto, credential)
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() credential: ICredential) {
        return await this.questionCategory.delete(+id, credential)
    }

}
