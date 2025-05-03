import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

export enum CategoryType {
  ARTICLES = 'articles',
  ACADEMIC_MAJOR = 'academic_major',
  JOBS = 'jobs',
  SUBJECT = 'subject',
}

@Entity('categories')
export class Category {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({
    type: 'enum',
    enum: CategoryType,
  })
  type: CategoryType;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
