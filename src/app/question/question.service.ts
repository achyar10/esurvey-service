import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base.service';
import { Repository } from 'typeorm';
import { Question } from './question.entity';
import { CreateQuestionDto, QueryQuestionDto, UpdateQuestionDto } from './question.dto';
import { ResponseData } from '../../interfaces/response';
import { ICredential } from '../../interfaces/credential';

@Injectable()
export class QuestionService extends BaseService {

    constructor(
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
    ) { super() }

    async findAll(query: QueryQuestionDto): Promise<ResponseData> {
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
            order: { id: "DESC" },
            relations: ['question_category', 'answers']
        }
        if (page && limit) {
            options = {
                ...options,
                skip: (Number(page) - 1) * Number(limit),
                take: Number(limit),
            }
        }
        const [result, total] = await this.questionRepository.findAndCount(options);
        const data = {
            rows: result,
            pages: Math.ceil(total / Number(limit)),
            total
        }
        return this._success(HttpStatus.OK, 'OK', data.rows, Number(page), Number(limit), data.total, data.pages)
    }

    async findOne(id: number): Promise<ResponseData> {
        const data = await this.questionRepository.findOne({
            where: { id: id },
            relations: ['question_category', 'answers']
        });
        return this._success(HttpStatus.OK, 'OK', data)
    }

    async create(dto: CreateQuestionDto, credential: ICredential): Promise<ResponseData> {

        const answers: any = dto.answers

        const data = new Question()
        data.created_by = credential.user.fullname
        data.updated_by = credential.user.fullname
        data.description = dto.description
        data.is_active = dto.is_active
        data.question_category = dto.question_category_id
        data.answers = answers
        const save = await this.questionRepository.save(data)
        return this._success(HttpStatus.CREATED, 'Data has been saved', save);
    }

    async update(id: number, data: UpdateQuestionDto, credential: ICredential): Promise<ResponseData> {
        const check = await this.questionRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        const save = await this.questionRepository.save({ ...data, updated_by: credential.user.fullname, id: id })
        return this._success(HttpStatus.OK, 'Data has been updated', save);
    }

    async delete(id: number, credential: ICredential): Promise<ResponseData> {
        const check = await this.questionRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        Promise.all([
            this.questionRepository.save({ updated_by: credential.user.fullname, id: id }),
            this.questionRepository.softRemove(check)
        ])
        return this._success(HttpStatus.OK, 'Data has been deleted');
    }

}
