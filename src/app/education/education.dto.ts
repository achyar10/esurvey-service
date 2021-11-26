import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateEducationDto {

    @IsNotEmpty({ message: 'Name required!' })
    name: string;

}

export class UpdateEducationDto extends PartialType(CreateEducationDto) { }

export class QueryEducationDto {

    page: number;
    limit: number;
    query_by: string;
    query_value: string;

}