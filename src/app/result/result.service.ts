import { QuestionCategory } from './../question-category/question-category.entity';
import { QuestionnaireRespondent } from './../questionnaire-respondent/questionnaire-respondent.entity';
import { HttpStatus, Injectable } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import BaseService from '../../base.service';
import { Repository } from 'typeorm';
import { ResponseData } from '../../interfaces/response';
import { IResultRespondent } from './result.interface';
import { Questionnaire } from '../questionnaire/questionnaire.entity';
import { Question } from '../question/question.entity';
import { RespondentAnswer } from '../respondent-answer/respondent-answer.entity';
import { Respondent } from '../respondent/respondent.entity';
import { User } from '../user/user.entity';

@Injectable()
export class ResultService extends BaseService {

    constructor(
        @InjectRepository(Respondent)
        private readonly respondentRepository: Repository<Respondent>,
        @InjectRepository(User)
        private readonly userRepository: Repository<User>,
        @InjectRepository(Questionnaire)
        private readonly questionnaireRepository: Repository<Questionnaire>,
        @InjectRepository(QuestionCategory)
        private readonly categoryRepository: Repository<QuestionCategory>,
        @InjectRepository(QuestionnaireRespondent)
        private readonly questionnaireRespondentRepository: Repository<QuestionnaireRespondent>,
        @InjectRepository(Question)
        private readonly questionRepository: Repository<Question>,
        @InjectRepository(RespondentAnswer)
        private readonly respondentAnswerRepository: Repository<RespondentAnswer>,
    ) { super() }

    async getQuestionnaire(): Promise<ResponseData> {
        const data = await this.questionnaireRepository.find({
            select: ['id', 'name', 'start_date', 'end_date'],
            order: { id: 'DESC' }
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

    async getChart(id: number): Promise<ResponseData> {
        const questions = await this.questionRepository.find({
            select: ['id', 'description'],
            relations: ['answers']
        })

        const answers = await this.respondentAnswerRepository.createQueryBuilder('rs')
            .leftJoin('rs.question_answer', 'question_answer')
            .leftJoin('rs.questionnaire_respondent', 'questionnaire_respondent')
            .leftJoin('questionnaire_respondent.questionnaire', 'questionnaire')
            .where('questionnaire.id = :id', { id })
            .select(['rs.id', 'question_answer.id', 'questionnaire_respondent.id', 'questionnaire.id'])
            .getMany();

        const result: any[] = []
        for (const q of questions) {

            result.push({
                description: q.description,
                answers: q.answers.map(el => {
                    const check = answers.filter(a => a.question_answer.id === el.id);
                    return {
                        answer_description: el.index_name,
                        total: check.length,
                    }
                })

            })
        }

        return this._success(HttpStatus.OK, 'OK', result);
    }

    async dashboard(id: number): Promise<ResponseData> {
        const respondent = await this.respondentRepository.count();
        const users = await this.userRepository.count();
        const questionnaire = await this.questionnaireRepository.count();
        const respondentQuestionnaire = await this.questionnaireRespondentRepository.count({
            where: { questionnaire: id }
        });

        const result = {
            total_respondent: respondent,
            total_user: users,
            total_questionnaire: questionnaire,
            total_respondent_questionnaire: respondentQuestionnaire,
        }
        return this._success(HttpStatus.OK, 'OK', result);
    }


}
