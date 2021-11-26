import { Controller, Post, Body, HttpCode } from '@nestjs/common';
import { AuthService } from './auth.service';
import { LoginAuthDto, LoginRespondentDto } from './auth.dto';

@Controller('auth')
export class AuthController {
  constructor(private readonly authService: AuthService) { }

  @Post('login')
  @HttpCode(200)
  login(@Body() dto: LoginAuthDto) {
    return this.authService.login(dto);
  }

  @Post('respondent')
  @HttpCode(200)
  loginRespondent(@Body() dto: LoginRespondentDto) {
    return this.authService.signRespondent(dto);
  }



}
