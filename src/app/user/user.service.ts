import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { ResponseData } from '../../interfaces/response';
import { Repository } from 'typeorm';
import BaseService from '../../base.service';
import { QueryUserDto, CreateUserDto, ResetPasswordDto } from './user.dto';
import { User } from './user.entity';
import Helper from '../../utilities/authentication';
import { ICredential } from '../../interfaces/credential';

@Injectable()
export class UserService extends BaseService {

    constructor(
        @InjectRepository(User)
        private userRepository: Repository<User>
    ) { super() }

    async findAll(query: QueryUserDto): Promise<ResponseData> {
        const { page, limit, query_by, query_value } = query

        let filter: any = {}
        if (query_by && query_value) {
            filter = {
                ...filter,
                [query_by]: query_value
            }
        }
        let options: any = {
            where: filter,
            select: ['id', 'username', 'fullname', 'role', 'is_active', 'created_at'],
            order: { fullname: "ASC" }
        }
        if (page && limit) {
            options = {
                ...options,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
            }
        }
        const [result, total] = await this.userRepository.findAndCount(options);
        const data = {
            rows: result,
            pages: Math.ceil(total / Number(limit)),
            total
        }
        return this._success(HttpStatus.OK, 'OK', data.rows, Number(page), Number(limit), data.total, data.pages)
    }

    async findOne(id: number): Promise<ResponseData> {
        const data = await this.userRepository.findOne(id);
        delete data.password;
        return this._success(HttpStatus.OK, 'OK', data)
    }

    async create(data: CreateUserDto, credential: ICredential): Promise<ResponseData> {
        const user = new User()

        user.created_by = credential.user.fullname
        user.updated_by = credential.user.fullname

        user.username = data.username
        user.password = await Helper.hashing(data.password)
        user.fullname = data.fullname
        user.role = data.role
        user.is_active = data.is_active
        const save = await this.userRepository.save(user)
        delete save.password
        return this._success(HttpStatus.CREATED, 'Data has been saved', save);
    }

    async update(id: number, data: any, credential: ICredential): Promise<ResponseData> {
        const check = await this.userRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        const save = await this.userRepository.save({ ...data, updated_by: credential.user.fullname, id: id })
        return this._success(HttpStatus.OK, 'Data has been updated', save);
    }

    async delete(id: number, credential: ICredential): Promise<ResponseData> {
        const check = await this.userRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);
        
        if (check.id === credential.user.user_id) throw new HttpException('You can not delete yourself!', HttpStatus.BAD_REQUEST);
        
        if(check.role === 'superadmin') throw new HttpException('You can not delete this user!', HttpStatus.BAD_REQUEST);

        Promise.all([
            this.userRepository.save({ updated_by: credential.user.fullname, id: id }),
            this.userRepository.softRemove(check)
        ])
        return this._success(HttpStatus.OK, 'Data has been deleted');
    }

    async resetPassword(id: number, data: ResetPasswordDto): Promise<ResponseData> {
        const check = await this.userRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);
        await this.userRepository.update(id, { password: await Helper.hashing(data.password) })
        return this._success(HttpStatus.OK, 'Data has been updated');
    }

}