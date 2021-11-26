import { PartialType } from '@nestjs/mapped-types';

export class CreateQuestionnaireRespondentDto {

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