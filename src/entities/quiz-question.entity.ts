import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { Quiz } from './quiz.entity';
import { Question } from './question.entity';

@Entity('quiz_questions')
export class QuizQuestion {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  quiz_id: number;

  @Column()
  question_id: number;

  @Column()
  question_order: number;

  @ManyToOne(() => Quiz, (quiz) => quiz.quizQuestions)
  @JoinColumn({ name: 'quiz_id' })
  quiz: Quiz;

  @ManyToOne(() => Question, (question) => question.quizQuestions)
  @JoinColumn({ name: 'question_id' })
  question: Question;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
