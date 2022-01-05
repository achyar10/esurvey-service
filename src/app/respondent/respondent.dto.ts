import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateRespondentDto {

    @IsNotEmpty({ message: 'NIK / NIP required!' })
    nik: string;

    @IsNotEmpty({ message: 'Name required!' })
    fullname: string;
    
    gender: string;

    @IsNotEmpty({ message: 'Birth Year required!' })
    birthyear: number;

    is_active: boolean;

    @IsNotEmpty()
    education_id: any;

    @IsNotEmpty()
    job_status_id: any;

    @IsNotEmpty()
    job_title_id: any;

}

export class UpdateRespondentDto extends PartialType(CreateRespondentDto) { }

export class QueryRespondentDto {

    page: number;
    limit: number;
    query_by: string;
    query_value: string;

}