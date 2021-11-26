import { Column, CreateDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { Questionnaire } from "../questionnaire/questionnaire.entity";
import { RespondentAnswer } from "../respondent-answer/respondent-answer.entity";
import { Respondent } from "../respondent/respondent.entity";

@Entity('questionnaire_respondents')
export class QuestionnaireRespondent {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    suggestion: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @ManyToOne(() => Respondent, data => data.questionnaires, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'respondent_id' })
    respondent: Respondent
    @RelationId((field: QuestionnaireRespondent) => field.respondent)
    respondent_id: number;

    @ManyToOne(() => Questionnaire, data => data.questionnaires, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'questionnaire_id' })
    questionnaire: Questionnaire
    @RelationId((field: QuestionnaireRespondent) => field.questionnaire)
    questionnaire_id: number;

    @OneToMany(() => RespondentAnswer, data => data.questionnaire_respondent, { onDelete: 'CASCADE', cascade: ['insert', 'update'] })
    answers: RespondentAnswer[];
}