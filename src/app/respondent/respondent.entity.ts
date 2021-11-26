import { Column, CreateDateColumn, DeleteDateColumn, Entity, Index, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { Education } from "../education/education.entity";
import { JobStatus } from "../job-status/job-status.entity";
import { JobTitle } from "../job-title/job-title.entity";
import { QuestionnaireRespondent } from "../questionnaire-respondent/questionnaire-respondent.entity";

@Entity('respondents')
export class Respondent {
    @PrimaryGeneratedColumn()
    id: number;

    @Index()
    @Column()
    nik: string;

    @Column()
    fullname: string;

    @Column({ type: 'enum', enum: ['male', 'female'], default: 'male' })
    gender: string;

    @Column({ type: 'int', nullable: true })
    birthyear: number;

    @Column({ default: false })
    is_active: boolean;

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

    @ManyToOne(() => Education, data => data.respondents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'education_id' })
    education: Education
    @RelationId((field: Respondent) => field.education)
    education_id: number;

    @ManyToOne(() => JobTitle, data => data.respondents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_title_id' })
    job_title: JobTitle
    @RelationId((field: Respondent) => field.job_title)
    job_title_id: number;

    @ManyToOne(() => JobStatus, data => data.respondents, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'job_status_id' })
    job_status: JobStatus
    @RelationId((field: Respondent) => field.job_status)
    job_status_id: number;

    @OneToMany(() => QuestionnaireRespondent, data => data.respondent, { onDelete: 'CASCADE' })
    questionnaires: QuestionnaireRespondent[];
}