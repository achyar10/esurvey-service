import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base.service';
import { ILike, Repository } from 'typeorm';
import { Respondent } from './respondent.entity';
import { CreateRespondentDto, QueryRespondentDto } from './respondent.dto';
import { ResponseData } from '../../interfaces/response';
import { ICredential } from '../../interfaces/credential';

@Injectable()
export class RespondentService extends BaseService {

    constructor(
        @InjectRepository(Respondent)
        private readonly respondentRepository: Repository<Respondent>,
    ) { super() }

    async findAll(query: QueryRespondentDto): Promise<ResponseData> {
        const { page, limit, query_by, query_value } = query

        let filter: any = {}
        if (query_by && query_value) {
            if (query_by === 'fullname') {
                filter = {
                    ...filter,
                    fullname: ILike(`%${query_value}%`)
                }
            } else {
                filter = {
                    ...filter,
                    [query_by]: query_value
                }
            }
        }
        let options: any = {
            where: filter,
            order: { id: "DESC" },
            relations: ['education', 'job_status', 'job_title']
        }
        if (page && limit) {
            options = {
                ...options,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
            }
        }
        const [result, total] = await this.respondentRepository.findAndCount(options);
        const data = {
            rows: result,
            pages: Math.ceil(total / Number(limit)),
            total
        }
        return this._success(HttpStatus.OK, 'OK', data.rows, Number(page), Number(limit), data.total, data.pages)
    }

    async findOne(id: number): Promise<ResponseData> {
        const data = await this.respondentRepository.findOne({
            where: { id },
            relations: ['education', 'job_status', 'job_title']
        });
        return this._success(HttpStatus.OK, 'OK', data)
    }

    async create(dto: CreateRespondentDto, credential: ICredential): Promise<ResponseData> {

        const check = await this.respondentRepository.findOne({ nik: dto.nik })
        if (check) throw new HttpException('NIK / NIP sudah digunakan!', HttpStatus.BAD_REQUEST);

        const data = new Respondent()
        data.created_by = credential.user.fullname
        data.updated_by = credential.user.fullname
        data.nik = dto.nik
        data.fullname = dto.fullname
        data.gender = dto.gender
        data.birthyear = dto.birthyear

        data.education = dto.education_id
        data.job_status = dto.job_status_id
        data.job_title = dto.job_title_id
        data.is_active = dto.is_active
        const save = await this.respondentRepository.save(data)
        return this._success(HttpStatus.CREATED, 'Data has been saved', save);
    }

    async update(id: number, dto: any, credential: ICredential): Promise<ResponseData> {
        const check = await this.respondentRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        const save = await this.respondentRepository.save({
            ...dto,
            updated_by: credential.user.fullname,
            id: id
        })
        return this._success(HttpStatus.OK, 'Data has been updated', save);
    }

    async delete(id: number, credential: ICredential): Promise<ResponseData> {
        const check = await this.respondentRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        Promise.all([
            this.respondentRepository.save({ updated_by: credential.user.fullname, id: id }),
            this.respondentRepository.softRemove(check)
        ])
        return this._success(HttpStatus.OK, 'Data has been deleted');
    }

}
