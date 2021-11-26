import { IsNotEmpty } from 'class-validator';

export class LoginAuthDto {

    @IsNotEmpty({ message: 'Username required!' })
    username: string;

    @IsNotEmpty({ message: 'Password required!' })
    password: string;

}

export class LoginRespondentDto {

    @IsNotEmpty({ message: 'NIP or NIK required!' })
    nik: string;

}
