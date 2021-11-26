import { Entity, JoinColumn, ManyToOne, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { QuestionAnswer } from "../question-answer/question-answer.entity";
import { QuestionnaireRespondent } from "../questionnaire-respondent/questionnaire-respondent.entity";

@Entity('respondent_answers')
export class RespondentAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @ManyToOne(() => QuestionnaireRespondent, data => data.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'questionnaire_respondent_id' })
    questionnaire_respondent: QuestionnaireRespondent
    @RelationId((field: RespondentAnswer) => field.questionnaire_respondent)
    questionnaire_respondent_id: number;

    @ManyToOne(() => QuestionAnswer, data => data.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'question_answer_id' })
    question_answer: QuestionAnswer
    @RelationId((field: RespondentAnswer) => field.question_answer)
    question_answer_id: number;
}