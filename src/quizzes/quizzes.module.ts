import { Module } from '@nestjs/common';
import { TypeOrmModule } from '@nestjs/typeorm';
import { QuizzesService } from './quizzes.service';
import { QuizzesController } from './quizzes.controller';
import { Quiz } from '../entities/quiz.entity';
import { QuizQuestion } from '../entities/quiz-question.entity';

@Module({
  imports: [TypeOrmModule.forFeature([Quiz, QuizQuestion])],
  controllers: [QuizzesController],
  providers: [QuizzesService],
  exports: [QuizzesService],
})
export class QuizzesModule {}
