import { IsString, IsNotEmpty, IsArray, IsOptional, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsString()
  @IsNotEmpty()
  type: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsString()
  @IsNotEmpty()
  correct_answer: string | string[];
}

export class CreateQuestionDto {
  @IsString()
  @IsNotEmpty()
  question_text: string;

  @ValidateNested()
  @Type(() => AnswerDto)
  answer: AnswerDto;
} 