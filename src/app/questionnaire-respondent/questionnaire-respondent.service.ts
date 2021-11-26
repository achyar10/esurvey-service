import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base.service';
import { Repository } from 'typeorm';
import { QuestionnaireRespondent } from './questionnaire-respondent.entity';
import { CreateQuestionnaireRespondentDto, QueryQuestionnaireRespondentDto, UpdateQuestionnaireRespondentDto } from './questionnaire-respondent.dto';
import { ResponseData } from '../../interfaces/response';
import { ICredential } from '../../interfaces/credential';

@Injectable()
export class QuestionnaireRespondentService extends BaseService {

    constructor(
        @InjectRepository(QuestionnaireRespondent)
        private readonly questRespondentRepository: Repository<QuestionnaireRespondent>,
    ) { super() }

    async findAll(query: QueryQuestionnaireRespondentDto): Promise<ResponseData> {
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
        const [result, total] = await this.questRespondentRepository.findAndCount(options);
        const data = {
            rows: result,
            pages: Math.ceil(total / Number(limit)),
            total
        }
        return this._success(HttpStatus.OK, 'OK', data.rows, Number(page), Number(limit), data.total, data.pages)
    }

    async findOne(id: number): Promise<ResponseData> {
        const data = await this.questRespondentRepository.findOne(id);
        return this._success(HttpStatus.OK, 'OK', data)
    }

    async create(dto: CreateQuestionnaireRespondentDto): Promise<ResponseData> {
        const data = new QuestionnaireRespondent()

        data.respondent = dto.respondent_id
        data.questionnaire = dto.questionnaire_id
        data.suggestion = dto.suggestion
        data.answers = dto.answers
        
        const save = await this.questRespondentRepository.save(data)
        return this._success(HttpStatus.CREATED, 'Data has been saved', save);
    }

    async update(id: number, data: UpdateQuestionnaireRespondentDto, credential: ICredential): Promise<ResponseData> {
        const check = await this.questRespondentRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        const save = await this.questRespondentRepository.save({ ...data, updated_by: credential.user.fullname, id: id })
        return this._success(HttpStatus.OK, 'Data has been updated', save);
    }

    async delete(id: number, credential: ICredential): Promise<ResponseData> {
        const check = await this.questRespondentRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        Promise.all([
            this.questRespondentRepository.save({ updated_by: credential.user.fullname, id: id }),
            this.questRespondentRepository.softRemove(check)
        ])
        return this._success(HttpStatus.OK, 'Data has been deleted');
    }

}
