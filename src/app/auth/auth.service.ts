import { HttpStatus, Injectable, UnauthorizedException } from '@nestjs/common';
import BaseService from '../../base.service';
import { InjectRepository } from '@nestjs/typeorm'
import { Repository } from 'typeorm';
import { LoginAuthDto, LoginRespondentDto } from './auth.dto';
import { JwtService } from '@nestjs/jwt';
import { ResponseData } from '../../interfaces/response';
import Helper from '../../utilities/authentication';
import { User } from '../user/user.entity';
import { Respondent } from '../respondent/respondent.entity';

@Injectable()
export class AuthService extends BaseService {

  constructor(
    @InjectRepository(User)
    private usersRepository: Repository<User>,
    @InjectRepository(Respondent)
    private respondentRepository: Repository<Respondent>,
    private jwtService: JwtService
  ) {
    super()
  }

  async login(dto: LoginAuthDto): Promise<ResponseData> {

    // Check Username
    const check = await this.usersRepository.findOne({
      where: { username: dto.username, is_active: true },
    })
    if (!check) throw new UnauthorizedException('User tidak terdaftar atau belum aktif!');

    // Compare Password
    const valid = await Helper.compare(dto.password, check.password)
    if (!valid) throw new UnauthorizedException('Password salah!');

    const payload: object = {
      user_id: check.id,
      username: check.username,
      fullname: check.fullname,
      role: check.role,
    }
    const access_token = this.jwtService.sign(payload)

    return this._success(HttpStatus.OK, 'Login Succeeded', { ...payload, access_token })

  }

  async signRespondent(dto: LoginRespondentDto): Promise<ResponseData> {
      
      // Check Respondent
      const respondent = await this.respondentRepository.findOne({
        where: { nik: dto.nik, is_active: true },
        select: ['id', 'nik', 'fullname', 'is_active'],
        relations: ['education', 'job_title', 'job_status']
      })
      if (!respondent) throw new UnauthorizedException('Respondent tidak terdaftar atau belum aktif!');
  
      const payload: object = {
        respondent_id: respondent.id,
        nik: respondent.nik,
        fullname: respondent.fullname,
        is_active: respondent.is_active,
        education: respondent.education.name,
        job_title: respondent.job_title.name,
        job_status: respondent.job_status.name
      }
      const access_token = this.jwtService.sign({respondent_id: respondent.id})
  
    return this._success(HttpStatus.OK, 'Login Succeeded', { ...payload, access_token })
  
  }


}
