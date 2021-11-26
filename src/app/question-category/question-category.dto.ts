import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateQuestionCategoryDto {

    @IsNotEmpty({ message: 'Code required!' })
    code: string;

    @IsNotEmpty({ message: 'Name required!' })
    name: string;

}

export class UpdateQuestionCategoryDto extends PartialType(CreateQuestionCategoryDto) { }

export class QueryQuestionCategoryDto {

    page: number;
    limit: number;
    query_by: string;
    query_value: string;

}