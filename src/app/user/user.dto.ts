import { PartialType } from '@nestjs/mapped-types';
import { IsNotEmpty } from 'class-validator';

export class CreateUserDto {

    @IsNotEmpty({ message: 'Username required!' })
    username: string;

    @IsNotEmpty({ message: 'Password required!' })
    password: string;

    @IsNotEmpty({ message: 'Full Name required!' })
    fullname: string;

    role: string;

    is_active: boolean;

}

export class UpdateuserDto extends PartialType(CreateUserDto) { }

export class QueryUserDto {

    page: number;
    limit: number;
    query_by: string;
    query_value: string;

}