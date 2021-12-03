import { QuestionCategory } from './../question-category/question-category.entity';
import { QuestionnaireRespondent } from './../questionnaire-respondent/questionnaire-respondent.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base.service';
import { Repository } from 'typeorm';
import { ResponseData } from '../../interfaces/response';
import { IResultRespondent } from './result.interface';
import { Questionnaire } from '../questionnaire/questionnaire.entity';

@Injectable()
export class ResultService extends BaseService {

    constructor(
        @InjectRepository(Questionnaire)
        private readonly questionnaireRepository: Repository<Questionnaire>,
        @InjectRepository(QuestionCategory)
        private readonly categoryRepository: Repository<QuestionCategory>,
        @InjectRepository(QuestionnaireRespondent)
        private readonly questionnaireRespondentRepository: Repository<QuestionnaireRespondent>,
    ) { super() }

    async getQuestionnaire(): Promise<ResponseData> {
        const data = await this.questionnaireRepository.find({
            select: ['id', 'name', 'start_date', 'end_date'],
        })
        return this._success(HttpStatus.OK, 'OK', data);
    }

    async getResult(id: number): Promise<ResponseData> {

        const categories = await this.categoryRepository.find({
            select: ['id', 'code', 'name'],
        })

        const data = await this.questionnaireRespondentRepository.createQueryBuilder('qr')
            .where('qr.questionnaire = :id', { id })
            .leftJoin('qr.answers', 'answers')
            .leftJoin('qr.respondent', 'respondent')
            .leftJoin('answers.question_answer', 'question_answer')
            .leftJoin('question_answer.question', 'question')
            .leftJoin('question.question_category', 'question_category')
            .select(['qr.id', 'respondent.id', 'answers.id', 'question_answer.index_code', 'question.id', 'question_category.id'])
            .getMany();

        const respondent: IResultRespondent[] = [];
        for (const i of data) {
            respondent.push({
                respondent_id: i.respondent.id,
                answers: i.answers.map(el => {
                    return {
                        index_code: el.question_answer.index_code,
                        index_value: el.question_answer.index_code.toLowerCase().charCodeAt(0) - 97 + 1,
                        category: el.question_answer.question.question_category.id,
                    }
                })
            })
        }

        const result: any[] = []
        for (const c of categories) {
            let total: number = 0
            for (const r of respondent) {
                const check = r.answers.find(el => el.category === c.id);
                if (check) total += check.index_value
            }
            result.push({
                category_code: c.code,
                category_name: c.name,
                total_respondent: respondent.length,
                total_value: total,
                average: (total / respondent.length).toFixed(2),
                nrr: (total / respondent.length) * 0.11,
            })
        }

        return this._success(HttpStatus.OK, 'OK', {
            details: result,
            skm: (result.reduce((a, b) => a + b.nrr, 0) * 25).toFixed(2),
        });
    }


}
