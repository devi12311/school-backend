import {
  Entity,
  PrimaryGeneratedColumn,
  Column,
  CreateDateColumn,
  UpdateDateColumn,
  OneToMany,
} from 'typeorm';
import { Major } from './major.entity';

@Entity('universities')
export class University {
  @PrimaryGeneratedColumn()
  id: number;

  @Column({ nullable: true })
  name: string;

  @Column({ nullable: true })
  description: string;

  @Column({ nullable: true })
  location: string;

  @Column({ nullable: true })
  website: string;

  @Column({ nullable: true })
  ranking: string;

  @Column({ nullable: true })
  acceptance_rate: string;

  @Column({ nullable: true })
  logo: string;

  @Column({ nullable: true })
  tuition: string;

  @Column({ nullable: true })
  email: string;

  @Column({ nullable: true })
  banner: string;

  @OneToMany(() => Major, (major) => major.university)
  majors: Major[];

  @CreateDateColumn()
  created_at: Date;

  @UpdateDateColumn()
  updated_at: Date;
}
