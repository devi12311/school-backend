import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  ManyToOne,
  JoinColumn,
} from 'typeorm';
import { User } from './user.entity';

@Entity()
export class Progress {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  user_id: number;

  @Column('jsonb')
  quiz_progress: {
    [quizId: number]: {
      progress: number;
      answered_questions: number[];
      time_spent: number;
      last_updated: Date;
    };
  };

  @ManyToOne(() => User)
  @JoinColumn({ name: 'user_id' })
  user: User;
}
