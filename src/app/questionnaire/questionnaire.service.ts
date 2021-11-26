import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base.service';
import { Repository } from 'typeorm';
import { Questionnaire } from './questionnaire.entity';
import { CreateQuestionnaireDto, QueryQuestionnaireDto, UpdateQuestionnaireDto } from './questionnaire.dto';
import { ResponseData } from '../../interfaces/response';
import { ICredential } from '../../interfaces/credential';

@Injectable()
export class QuestionnaireService extends BaseService {

    constructor(
        @InjectRepository(Questionnaire)
        private readonly questionnaireRepository: Repository<Questionnaire>,
    ) { super() }

    async findAll(query: QueryQuestionnaireDto): Promise<ResponseData> {
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
            order: { id: "DESC" }
        }
        if (page && limit) {
            options = {
                ...options,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
            }
        }
        const [result, total] = await this.questionnaireRepository.findAndCount(options);
        const data = {
            rows: result,
            pages: Math.ceil(total / Number(limit)),
            total
        }
        return this._success(HttpStatus.OK, 'OK', data.rows, Number(page), Number(limit), data.total, data.pages)
    }

    async findOne(id: number): Promise<ResponseData> {
        const data = await this.questionnaireRepository.findOne(id);
        return this._success(HttpStatus.OK, 'OK', data)
    }

    async create(dto: CreateQuestionnaireDto, credential: ICredential): Promise<ResponseData> {
        const data = new Questionnaire()
        data.created_by = credential.user.fullname
        data.updated_by = credential.user.fullname
        data.name = dto.name
        data.description = dto.description
        data.start_date = dto.start_date
        data.end_date = dto.end_date
        data.is_limit = dto.is_limit
        data.max_respondent = dto.max_respondent
        const save = await this.questionnaireRepository.save(data)
        return this._success(HttpStatus.CREATED, 'Data has been saved', save);
    }

    async update(id: number, data: UpdateQuestionnaireDto, credential: ICredential): Promise<ResponseData> {
        const check = await this.questionnaireRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        const save = await this.questionnaireRepository.save({ ...data, updated_by: credential.user.fullname, id: id })
        return this._success(HttpStatus.OK, 'Data has been updated', save);
    }

    async delete(id: number, credential: ICredential): Promise<ResponseData> {
        const check = await this.questionnaireRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        Promise.all([
            this.questionnaireRepository.save({ updated_by: credential.user.fullname, id: id }),
            this.questionnaireRepository.softRemove(check)
        ])
        return this._success(HttpStatus.OK, 'Data has been deleted');
    }

}
