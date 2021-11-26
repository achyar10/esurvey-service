import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export interface IAnswers {
    index_code: string;
    index_name: string;
}

export class CreateQuestionDto {

    @IsNotEmpty({ message: 'Name required!' })
    description: string;

    @IsNotEmpty({ message: 'Question Category required!' })
    question_category_id: any;

    answers: IAnswers[]

    is_active: boolean;

}

export class UpdateQuestionDto extends PartialType(CreateQuestionDto) { }

export class QueryQuestionDto {

    page: number;
    limit: number;
    query_by: string;
    query_value: string;

}