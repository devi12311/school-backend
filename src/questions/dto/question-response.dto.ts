import { Exclude } from 'class-transformer';

class QuizResponseDto {
  id: number;
  title: string;
}

export class QuestionResponseDto {
  id: number;
  question: string;
  options: string[];
  correct_answer: string;
  quiz?: QuizResponseDto;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
} 