import { QuestionCategory } from './../question-category/question-category.entity';
import { QuestionnaireRespondent } from './../questionnaire-respondent/questionnaire-respondent.entity';
import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { ResultController } from './result.controller';
import { Questionnaire } from '../questionnaire/questionnaire.entity';
import { ResultService } from './result.service';
import { Question } from '../question/question.entity';
import { RespondentAnswer } from '../respondent-answer/respondent-answer.entity';
import { Respondent } from '../respondent/respondent.entity';
import { User } from '../user/user.entity';

@Module({
    imports: [TypeOrmModule.forFeature([
        Respondent,
        User,
        QuestionCategory, 
        Questionnaire, 
        QuestionnaireRespondent,
        Question,
        RespondentAnswer,
    ])],
    exports: [TypeOrmModule],
    controllers: [ResultController],
    providers: [ResultService],
})
export class ResultModule {};