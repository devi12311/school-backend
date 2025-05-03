import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
} from 'typeorm';

@Entity('jobs')
export class Job {
  @PrimaryGeneratedColumn()
  id: number;

  @Column()
  title: string;

  @Column('text')
  excerpt: string;

  @Column()
  companyName: string;

  @Column()
  companyLogo: string;

  @Column()
  employmentType: string;

  @Column({ nullable: true })
  minSalary: number;

  @Column({ nullable: true })
  maxSalary: number;

  @Column('simple-array')
  seniority: string[];

  @Column('simple-array')
  locationRestrictions: string[];

  @Column('simple-array')
  timezoneRestrictions: number[];

  @Column('simple-array')
  categories: string[];

  @Column('simple-array')
  parentCategories: string[];

  @Column('text')
  description: string;

  @Column()
  pubDate: number;

  @Column()
  expiryDate: number;

  @Column()
  applicationLink: string;

  @Column()
  guid: string;

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
