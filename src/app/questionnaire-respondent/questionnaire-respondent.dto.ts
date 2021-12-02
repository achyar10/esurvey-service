import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateQuestionnaireRespondentDto {

    @IsNotEmpty()
    respondent_id: any;
    
    questionnaire_id: any;
    suggestion: string;
    answers: any[];

}

export class UpdateQuestionnaireRespondentDto extends PartialType(CreateQuestionnaireRespondentDto) { }

export class QueryQuestionnaireRespondentDto {

    page: number;
    limit: number;
    query_by: string;
    query_value: string;

}