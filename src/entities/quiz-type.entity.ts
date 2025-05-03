import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum QuizTypeEnum {
  PERSONALITY = 'personality',
  HOBBIES = 'hobbies',
  TRAITS = 'traits',
  ACADEMIC_ORIENTATION = 'academic_orientation',
}

@Entity('quiz_types')
export class QuizType {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: QuizTypeEnum,
  })
  name: QuizTypeEnum;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
