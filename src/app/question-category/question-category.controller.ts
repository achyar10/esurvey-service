import { Body, Controller, Delete, Get, Param, Post, Put, Query, Req, UseGuards } from '@nestjs/common';
import { JwtAuthGuard } from '../../utilities/guards/jwt-guard.guard';
import { QuestionCategoryService } from './question-category.service';
import { QueryQuestionCategoryDto, CreateQuestionCategoryDto, UpdateQuestionCategoryDto } from './question-category.dto';
import { ICredential } from '../../interfaces/credential';

@Controller('question-category')
@UseGuards(JwtAuthGuard)
export class QuestionCategoryController {

    constructor(private readonly questionCategory: QuestionCategoryService) { }

    @Get()
    findAll(@Query() query: QueryQuestionCategoryDto) {
        return this.questionCategory.findAll(query);
    }

    @Get(':id')
    findOne(@Param('id') id: number) {
        return this.questionCategory.findOne(id);
    }

    @Post()
    async create(@Body() dto: CreateQuestionCategoryDto, @Req() credential: ICredential) {
        return await this.questionCategory.create(dto, credential)
    }

    @Put(':id')
    async update(@Param('id') id: string, @Body() dto: UpdateQuestionCategoryDto, @Req() credential: ICredential) {
        return await this.questionCategory.update(+id, dto, credential)
    }

    @Delete(':id')
    async delete(@Param('id') id: string, @Req() credential: ICredential) {
        return await this.questionCategory.delete(+id, credential)
    }

}
