import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateQuestionnaireDto {

    @IsNotEmpty({ message: 'Name required!' })
    name: string;

    @IsNotEmpty()
    start_date: Date;

    @IsNotEmpty()
    end_date: Date;

    description: string;
    is_limit: boolean;
    max_respondent: number;

}

export class UpdateQuestionnaireDto extends PartialType(CreateQuestionnaireDto) { }

export class QueryQuestionnaireDto {

    page: number;
    limit: number;
    query_by: string;
    query_value: string;

}