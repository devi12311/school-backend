import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { QuizQuestion } from './quiz-question.entity';
import { IsEnum } from 'class-validator';

export enum QuizType {
  PERSONALITY = 'personality',
  INTERESTS = 'interests',
  SKILLS = 'skills',
  DECISION_MAKING = 'decision_making',
  IMAGINATION = 'imagination',
  SOCIAL_SKILLS = 'social_skills',
  ANALYTICAL_SKILLS = 'analytical_skills',
  EVALUATION = 'evaluation',
}

@Entity('quizzes')
export class Quiz {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column()
  @IsEnum(QuizType)
  type: QuizType;

  @Column('text')
  description: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;

  @OneToMany(() => QuizQuestion, (quizQuestion) => quizQuestion.quiz)
  quizQuestions: QuizQuestion[];
}
