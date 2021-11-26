import { Column, CreateDateColumn, DeleteDateColumn, Entity, OneToMany, PrimaryGeneratedColumn, UpdateDateColumn } from "typeorm";
import { QuestionnaireRespondent } from "../questionnaire-respondent/questionnaire-respondent.entity";

@Entity('questionnaires')
export class Questionnaire {
    @PrimaryGeneratedColumn()
    id: number;

    @Column()
    name: string;

    @Column()
    description: string;

    @Column({ type: 'date' })
    start_date: Date;

    @Column({ type: 'date' })
    end_date: Date;

    @Column({ default: false })
    is_limit: boolean;

    @Column({ default: 0 })
    max_respondent: number;

    @Column({ nullable: true })
    created_by: string;

    @Column({ nullable: true })
    updated_by: string;

    @CreateDateColumn({ type: 'timestamp' })
    created_at: Date;

    @UpdateDateColumn({ type: 'timestamp' })
    updated_at: Date;

    @DeleteDateColumn()
    deleted_at: Date;

    @OneToMany(() => QuestionnaireRespondent, data => data.questionnaire, { onDelete: 'CASCADE' })
    questionnaires: QuestionnaireRespondent[];
}