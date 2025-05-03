import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateQuizDto } from './create-quiz.dto';

export class BulkCreateQuizDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateQuizDto)
  quizzes: CreateQuizDto[];
} 