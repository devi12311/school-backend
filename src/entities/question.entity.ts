import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';

@Entity('questions')
export class Question {
  @PrimaryGeneratedColumn()
  id: number;

  @Column('text')
  question_text: string;

  @Column('text', { nullable: true })
  imageUrl?: string;

  @Column('text')
  type: string;

  @Column('jsonb')
  properties: {
    answers: { answer: string; tags: string[] }[];
    correct_answer?: { answer: string; tags: string[] };
  }[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => QuizQuestion, (quizQuestion) => quizQuestion.question)
  quizQuestions: QuizQuestion[];
}
