import { QuestionCategory } from './../question-category/question-category.entity';
import { QuestionnaireRespondent } from './../questionnaire-respondent/questionnaire-respondent.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultController } from './result.controller';
import { Questionnaire } from '../questionnaire/questionnaire.entity';
import { ResultService } from './result.service';

@Module({
    imports: [TypeOrmModule.forFeature([QuestionCategory, Questionnaire, QuestionnaireRespondent])],
    exports: [TypeOrmModule],
    controllers: [ResultController],
    providers: [ResultService],
})
export class ResultModule {};