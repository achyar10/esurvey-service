import { Column, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId } from "typeorm";
import { Question } from "../question/question.entity";
import { RespondentAnswer } from "../respondent-answer/respondent-answer.entity";

@Entity('question_answers')
export class QuestionAnswer {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    index_code: string;

    @Column()
    index_name: string;

    @ManyToOne(() => Question, data => data.answers, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'question_id' })
    question: Question
    @RelationId((field: QuestionAnswer) => field.question)
    question_id: number;

    @OneToMany(() => RespondentAnswer, data => data.question_answer, { onDelete: 'CASCADE' })
    answers: RespondentAnswer[];
}