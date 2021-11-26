import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../utilities/guards/jwt-guard.guard';
import { QuestionService } from './question.service';
import { QueryQuestionDto, CreateQuestionDto, UpdateQuestionDto } from './question.dto';
import { ICredential } from '../../interfaces/credential';

@Controller('question')
@UseGuards(JwtAuthGuard)
export class QuestionController {

    constructor(private readonly questionService: QuestionService) { }

    @Get()
    findAll(@Query() query: QueryQuestionDto) {
        return this.questionService.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.questionService.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateQuestionDto, @Req() credential: ICredential) {
        return await this.questionService.create(dto, credential)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateQuestionDto, @Req() credential: ICredential) {
        return await this.questionService.update(+id, dto, credential)
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() credential: ICredential) {
        return await this.questionService.delete(+id, credential)
    }

}
