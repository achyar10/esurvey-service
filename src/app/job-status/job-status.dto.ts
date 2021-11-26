import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateJobStatusDto {

    @IsNotEmpty({ message: 'Name required!' })
    name: string;

}

export class UpdateJobStatusDto extends PartialType(CreateJobStatusDto) { }

export class QueryJobStatusDto {

    page: number;
    limit: number;
    query_by: string;
    query_value: string;

}