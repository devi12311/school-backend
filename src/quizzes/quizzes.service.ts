import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { AddQuestionsDto } from './dto/add-questions.dto';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { BulkCreateQuizDto } from './dto/bulk-create-quiz.dto';
import { Question } from '../entities/question.entity';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private quizQuestionsRepository: Repository<QuizQuestion>,
  ) {}

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizzesRepository.create(createQuizDto);
    return this.quizzesRepository.save(quiz);
  }

  async bulkCreate(bulkCreateQuizDto: BulkCreateQuizDto): Promise<Quiz[]> {
    const quizzes = this.quizzesRepository.create(bulkCreateQuizDto.quizzes);
    return this.quizzesRepository.save(quizzes);
  }

  async findAll(): Promise<Quiz[]> {
    return this.quizzesRepository.find({
      relations: ['quizQuestions', 'quizQuestions.question'],
    });
  }

  async findOne(id: number): Promise<Quiz> {
    const quiz = await this.quizzesRepository.findOne({
      where: { id },
      relations: ['quizQuestions', 'quizQuestions.question'],
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
    return quiz;
  }

  async update(id: number, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.findOne(id);
    Object.assign(quiz, updateQuizDto);
    return this.quizzesRepository.save(quiz);
  }

  async remove(id: number): Promise<void> {
    const quiz = await this.findOne(id);
    await this.quizzesRepository.remove(quiz);
  }

  async addQuestions(
    id: number,
    addQuestionsDto: AddQuestionsDto,
  ): Promise<Quiz> {
    const quiz = await this.findOne(id);

    // Remove existing questions
    await this.quizQuestionsRepository.delete({ quiz_id: id });

    // Add new questions with their order
    const quizQuestions = addQuestionsDto.questions.map((q) =>
      this.quizQuestionsRepository.create({
        quiz_id: id,
        question_id: q.question_id,
        question_order: q.order,
      }),
    );

    await this.quizQuestionsRepository.save(quizQuestions);
    return this.findOne(id);
  }

  async matchQuestionsToQuiz(
    quizId: number,
    questionIds: number[],
  ): Promise<Quiz> {
    const quiz = await this.findOne(quizId);

    // Remove existing questions
    await this.quizQuestionsRepository.delete({ quiz_id: quizId });

    // Create new quiz-question relationships
    const quizQuestions = questionIds.map((questionId, index) =>
      this.quizQuestionsRepository.create({
        quiz_id: quizId,
        question_id: questionId,
        question_order: index + 1,
      }),
    );

    await this.quizQuestionsRepository.save(quizQuestions);
    return this.findOne(quizId);
  }

  async getQuestionsByQuizId(quizId: number): Promise<Question[]> {
    const quiz = await this.findOne(quizId);
    const quizQuestions = await this.quizQuestionsRepository.find({
      where: { quiz_id: quizId },
      relations: ['question'],
      order: { question_order: 'ASC' },
    });

    return quizQuestions.map((qq) => qq.question);
  }
}
