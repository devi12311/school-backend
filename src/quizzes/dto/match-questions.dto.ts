import { IsArray, IsNumber } from 'class-validator';

export class MatchQuestionsDto {
  @IsArray()
  @IsNumber({}, { each: true })
  question_ids: number[];
}
