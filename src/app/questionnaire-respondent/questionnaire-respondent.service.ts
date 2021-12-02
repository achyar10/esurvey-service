import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base.service';
import { Repository } from 'typeorm';
import { QuestionnaireRespondent } from './questionnaire-respondent.entity';
import { CreateQuestionnaireRespondentDto, QueryQuestionnaireRespondentDto, UpdateQuestionnaireRespondentDto } from './questionnaire-respondent.dto';
import { ResponseData } from '../../interfaces/response';
import { ICredential } from '../../interfaces/credential';
import { Questionnaire } from '../questionnaire/questionnaire.entity';
import * as moment from 'moment';

@Injectable()
export class QuestionnaireRespondentService extends BaseService {

    constructor(
        @InjectRepository(QuestionnaireRespondent)
        private readonly questRespondentRepository: Repository<QuestionnaireRespondent>,
        @InjectRepository(Questionnaire)
        private readonly questionnaireRepository: Repository<Questionnaire>,
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

        const dataQuestionnaires = await this.questionnaireRepository.find({
            select: ['id', 'start_date', 'end_date', 'is_limit', 'max_respondent'],
            order: { id: "DESC" }
        })
        let next: boolean = false;
        let questionnaire_id: any;
        for (const q of dataQuestionnaires) {
            const now = moment().format('YYYY-MM-DD')
            if (moment(now).isBetween(q.start_date, q.end_date)) {
                next = true;
                questionnaire_id = q.id;
                break;
            }
        }
        if (!next) throw new HttpException('Belum ada periode pengisian kuesioner', HttpStatus.BAD_REQUEST);

        const check = await this.questRespondentRepository.findOne({
            where: {
                questionnaire: questionnaire_id,
                respondent: dto.respondent_id
            }
        })
        if (check) throw new HttpException('Responden sudah pernah mengisi kuesioner di periode ini', HttpStatus.BAD_REQUEST);

        const data = new QuestionnaireRespondent()
        data.respondent = dto.respondent_id
        data.questionnaire = questionnaire_id
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
