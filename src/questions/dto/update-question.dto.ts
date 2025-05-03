import { IsString, IsOptional, IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';

class AnswerDto {
  @IsString()
  @IsOptional()
  type?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  options?: string[];

  @IsString()
  @IsOptional()
  correct_answer?: string | string[];
}

export class UpdateQuestionDto {
  @IsString()
  @IsOptional()
  question_text?: string;

  @ValidateNested()
  @Type(() => AnswerDto)
  @IsOptional()
  answer?: AnswerDto;
}
