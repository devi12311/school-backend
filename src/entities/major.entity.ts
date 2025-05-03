import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  ManyToOne,
  JoinColumn,
  OneToMany,
} from 'typeorm';
import { Category } from './category.entity';
import { University } from './university.entity';
import { Subject } from './subject.entity';

@Entity('majors')
export class Major {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  name: string;

  @Column('simple-array')
  tags: string[];

  @Column()
  category_id: number;

  @ManyToOne(() => Category)
  @JoinColumn({ name: 'category_id' })
  category: Category;

  @Column()
  university_id: number;

  @ManyToOne(() => University)
  @JoinColumn({ name: 'university_id' })
  university: University;

  @OneToMany(() => Subject, (subject) => subject.major)
  subjects: Subject[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
