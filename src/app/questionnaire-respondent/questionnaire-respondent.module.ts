import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { Questionnaire } from '../questionnaire/questionnaire.entity';
import { QuestionnaireRespondentController } from './questionnaire-respondent.controller';
import { QuestionnaireRespondent } from './questionnaire-respondent.entity';
import { QuestionnaireRespondentService } from './questionnaire-respondent.service';

@Module({
  imports: [TypeOrmModule.forFeature([QuestionnaireRespondent, Questionnaire])],
  exports: [TypeOrmModule],
  controllers: [QuestionnaireRespondentController],
  providers: [QuestionnaireRespondentService]
})
export class QuestionnaireRespondentModule {}
