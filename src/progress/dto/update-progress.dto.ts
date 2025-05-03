import { IsNumber, IsArray, IsDate } from 'class-validator';

export class UpdateProgressDto {
  @IsNumber()
  quiz_id: number;

  @IsNumber()
  progress: number;

  @IsArray()
  @IsNumber({}, { each: true })
  answered_questions: number[];

  @IsNumber()
  time_spent: number;

  @IsDate()
  last_updated: Date;
} 