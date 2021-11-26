import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateJobTitleDto {

    @IsNotEmpty({ message: 'Name required!' })
    name: string;

}

export class UpdateJobTitleDto extends PartialType(CreateJobTitleDto) { }

export class QueryJobTitleDto {

    page: number;
    limit: number;
    query_by: string;
    query_value: string;

}