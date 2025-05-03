import { Exclude } from 'class-transformer';

class QuestionResponseDto {
  id: number;
  question: string;
  properties: {
    answers: { answer: string; tags: string[] }[];
    correct_answer?: { answer: string; tags: string[] };
  }[];
}

export class QuizResponseDto {
  id: number;
  title: string;
  description: string;
  type: string;
  questions: QuestionResponseDto[];

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
