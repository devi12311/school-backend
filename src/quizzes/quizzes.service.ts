import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Quiz } from '../entities/quiz.entity';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import {
  AddQuestionsByTypeDto,
  AddQuestionsDto,
} from './dto/add-questions.dto';
import { QuizQuestion } from '../entities/quiz-question.entity';
import { BulkCreateQuizDto } from './dto/bulk-create-quiz.dto';
import { Question } from '../entities/question.entity';
import { QuizType } from '../entities/quiz.entity';
import { QuizResponseDto } from './dto/quiz-response.dto';

@Injectable()
export class QuizzesService {
  constructor(
    @InjectRepository(Quiz)
    private quizzesRepository: Repository<Quiz>,
    @InjectRepository(QuizQuestion)
    private quizQuestionsRepository: Repository<QuizQuestion>,
    @InjectRepository(Question)
    private questionRepository: Repository<Question>,
  ) {}

  private async getFullQuiz(id: number): Promise<Quiz> {
    const quiz = await this.quizzesRepository.findOne({
      where: { id },
      relations: ['quizQuestions', 'quizQuestions.question'],
    });
    if (!quiz) {
      throw new NotFoundException(`Quiz with ID ${id} not found`);
    }
    return quiz;
  }

  async findAll(): Promise<QuizResponseDto[]> {
    const quizzes = await this.quizzesRepository.find({
      relations: ['quizQuestions', 'quizQuestions.question'],
    });
    return quizzes.map(quiz => this.mapToResponseDto(quiz));
  }

  async findByType(type: QuizType): Promise<QuizResponseDto[]> {
    const quizzes = await this.quizzesRepository.find({
      where: { type },
      relations: ['quizQuestions', 'quizQuestions.question'],
    });
    return quizzes.map(quiz => this.mapToResponseDto(quiz));
  }

  async findOne(id: number): Promise<QuizResponseDto> {
    const quiz = await this.getFullQuiz(id);
    return this.mapToResponseDto(quiz);
  }

  async create(createQuizDto: CreateQuizDto): Promise<QuizResponseDto> {
    const quiz = this.quizzesRepository.create(createQuizDto);
    const savedQuiz = await this.quizzesRepository.save(quiz);
    return this.findOne(savedQuiz.id);
  }

  async bulkCreate(bulkCreateQuizDto: BulkCreateQuizDto): Promise<QuizResponseDto[]> {
    const quizzes = this.quizzesRepository.create(bulkCreateQuizDto.quizzes);
    const savedQuizzes = await this.quizzesRepository.save(quizzes);
    return Promise.all(savedQuizzes.map(quiz => this.findOne(quiz.id)));
  }

  async update(id: number, updateQuizDto: UpdateQuizDto): Promise<QuizResponseDto> {
    const quiz = await this.getFullQuiz(id);
    Object.assign(quiz, updateQuizDto);
    await this.quizzesRepository.save(quiz);
    return this.findOne(id);
  }

  async remove(id: number): Promise<void> {
    const quiz = await this.getFullQuiz(id);
    await this.quizzesRepository.remove(quiz);
  }

  async addQuestions(
    id: number,
    addQuestionsDto: AddQuestionsDto,
  ): Promise<QuizResponseDto> {
    const quiz = await this.getFullQuiz(id);
    const questions = await this.questionRepository.findByIds(
      addQuestionsDto.questions.map(q => q.question_id),
    );

    const quizQuestions = questions.map((question, index) =>
      this.quizQuestionsRepository.create({
        quiz,
        question,
        question_order: addQuestionsDto.questions[index].order,
      }),
    );

    await this.quizQuestionsRepository.save(quizQuestions);
    return this.findOne(id);
  }

  async matchQuestions(
    id: number,
    matchQuestionsDto: { question_ids: number[] },
  ): Promise<QuizResponseDto> {
    const quiz = await this.getFullQuiz(id);
    const questions = await this.questionRepository.findByIds(
      matchQuestionsDto.question_ids,
    );

    const quizQuestions = questions.map((question, index) =>
      this.quizQuestionsRepository.create({
        quiz,
        question,
        question_order: index + 1,
      }),
    );

    await this.quizQuestionsRepository.save(quizQuestions);
    return this.findOne(id);
  }

  async getQuestionsByQuizId(quizId: number): Promise<Question[]> {
    const quiz = await this.getFullQuiz(quizId);
    return quiz.quizQuestions
      .sort((a, b) => a.question_order - b.question_order)
      .map((qq) => qq.question);
  }

  async addQuestionsByType(
    id: number,
    addQuestionsByTypeDto: AddQuestionsByTypeDto,
  ): Promise<QuizResponseDto> {
    const quiz = await this.getFullQuiz(id);
    const questions = await this.questionRepository.find({
      where: { type: addQuestionsByTypeDto.type },
    });

    const quizQuestions = questions.map((question, index) =>
      this.quizQuestionsRepository.create({
        quiz,
        question,
        question_order: index + 1,
      }),
    );

    await this.quizQuestionsRepository.save(quizQuestions);
    return this.findOne(id);
  }

  private mapToResponseDto(quiz: Quiz): QuizResponseDto {
    return {
      id: quiz.id,
      title: quiz.title,
      description: quiz.description,
      type: quiz.type,
      questions: quiz.quizQuestions
        .sort((a, b) => a.question_order - b.question_order)
        .map(qq => ({
          id: qq.question.id,
          question: qq.question.question_text,
          properties: qq.question.properties,
        })),
      created_at: quiz.created_at,
      updated_at: quiz.updated_at,
    };
  }
}
