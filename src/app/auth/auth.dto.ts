import { IsNotEmpty } from 'class-validator';

export class LoginAuthDto {

    @IsNotEmpty({ message: 'Username required!' })
    username: string;

    @IsNotEmpty({ message: 'Password required!' })
    password: string;

}
