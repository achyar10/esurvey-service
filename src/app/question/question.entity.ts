import { Column, CreateDateColumn, DeleteDateColumn, Entity, JoinColumn, ManyToOne, OneToMany, PrimaryGeneratedColumn, RelationId, UpdateDateColumn } from "typeorm";
import { QuestionAnswer } from "../question-answer/question-answer.entity";
import { QuestionCategory } from "../question-category/question-category.entity";

@Entity('questions')
export class Question {
    @PrimaryGeneratedColumn()
    id: number;

    @Column({ type: 'text', nullable: true })
    description: string;

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

    @ManyToOne(() => QuestionCategory, data => data.questions, { onDelete: 'CASCADE' })
    @JoinColumn({ name: 'question_category_id' })
    question_category: QuestionCategory
    @RelationId((field: Question) => field.question_category)
    question_category_id: number;

    @OneToMany(() => QuestionAnswer, data => data.question, { onDelete: 'CASCADE', cascade: ['insert', 'update'] })
    answers: QuestionAnswer[];
}