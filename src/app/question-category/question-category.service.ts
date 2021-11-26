import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base.service';
import { Repository } from 'typeorm';
import { QuestionCategory } from './question-category.entity';
import { CreateQuestionCategoryDto, QueryQuestionCategoryDto, UpdateQuestionCategoryDto } from './question-category.dto';
import { ResponseData } from '../../interfaces/response';
import { ICredential } from '../../interfaces/credential';

@Injectable()
export class QuestionCategoryService extends BaseService {

    constructor(
        @InjectRepository(QuestionCategory)
        private readonly questionCategoryRepository: Repository<QuestionCategory>,
    ) { super() }

    async findAll(query: QueryQuestionCategoryDto): Promise<ResponseData> {
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
        const [result, total] = await this.questionCategoryRepository.findAndCount(options);
        const data = {
            rows: result,
            pages: Math.ceil(total / Number(limit)),
            total
        }
        return this._success(HttpStatus.OK, 'OK', data.rows, Number(page), Number(limit), data.total, data.pages)
    }

    async findOne(id: number): Promise<ResponseData> {
        const data = await this.questionCategoryRepository.findOne(id);
        return this._success(HttpStatus.OK, 'OK', data)
    }

    async create(dto: CreateQuestionCategoryDto, credential: ICredential): Promise<ResponseData> {
        const data = new QuestionCategory()
        data.created_by = credential.user.fullname
        data.updated_by = credential.user.fullname
        data.name = dto.name
        data.code = dto.code
        const save = await this.questionCategoryRepository.save(data)
        return this._success(HttpStatus.CREATED, 'Data has been saved', save);
    }

    async update(id: number, data: UpdateQuestionCategoryDto, credential: ICredential): Promise<ResponseData> {
        const check = await this.questionCategoryRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        const save = await this.questionCategoryRepository.save({ ...data, updated_by: credential.user.fullname, id: id })
        return this._success(HttpStatus.OK, 'Data has been updated', save);
    }

    async delete(id: number, credential: ICredential): Promise<ResponseData> {
        const check = await this.questionCategoryRepository.findOne(id)
        if (!check) throw new HttpException('Data not found!', HttpStatus.NOT_FOUND);

        Promise.all([
            this.questionCategoryRepository.save({ updated_by: credential.user.fullname, id: id }),
            this.questionCategoryRepository.softRemove(check)
        ])
        return this._success(HttpStatus.OK, 'Data has been deleted');
    }

}
