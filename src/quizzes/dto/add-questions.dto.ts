import { IsNumber, IsArray, ValidateNested, IsString } from 'class-validator';
import { Type } from 'class-transformer';

class QuestionOrderDto {
  @IsNumber()
  question_id: number;

  @IsNumber()
  order: number;
}

export class AddQuestionsDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => QuestionOrderDto)
  questions: QuestionOrderDto[];
}

export class AddQuestionsByTypeDto {
  @IsString()
  type: string;
}
