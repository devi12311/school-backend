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

interface SanitizedQuiz {
  title: string;
  type: string;
  description: string;
  questions: Array<{
    question_text: string;
    imageUrl?: string;
    properties: any;
  }>;
}

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

  private sanitizeQuiz(quiz: Quiz): SanitizedQuiz {
    return {
      title: quiz.title,
      type: quiz.type,
      description: quiz.description,
      questions: quiz.quizQuestions
        .sort((a, b) => a.question_order - b.question_order)
        .map((qq) => ({
          question_text: qq.question.question_text,
          imageUrl: qq.question.imageUrl,
          properties: qq.question.properties,
        })),
    };
  }

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

  async findAll(): Promise<SanitizedQuiz[]> {
    const quizzes = await this.quizzesRepository.find({
      relations: ['quizQuestions', 'quizQuestions.question'],
    });
    return quizzes.map(quiz => this.sanitizeQuiz(quiz));
  }

  async findByType(type: QuizType): Promise<SanitizedQuiz[]> {
    const quizzes = await this.quizzesRepository.find({
      where: { type },
      relations: ['quizQuestions', 'quizQuestions.question'],
    });
    return quizzes.map(quiz => this.sanitizeQuiz(quiz));
  }

  async findOne(id: number): Promise<SanitizedQuiz> {
    const quiz = await this.getFullQuiz(id);
    return this.sanitizeQuiz(quiz);
  }

  async create(createQuizDto: CreateQuizDto): Promise<Quiz> {
    const quiz = this.quizzesRepository.create(createQuizDto);
    return this.quizzesRepository.save(quiz);
  }

  async bulkCreate(bulkCreateQuizDto: BulkCreateQuizDto): Promise<Quiz[]> {
    const quizzes = this.quizzesRepository.create(bulkCreateQuizDto.quizzes);
    return this.quizzesRepository.save(quizzes);
  }

  async update(id: number, updateQuizDto: UpdateQuizDto): Promise<Quiz> {
    const quiz = await this.getFullQuiz(id);
    Object.assign(quiz, updateQuizDto);
    return this.quizzesRepository.save(quiz);
  }

  async remove(id: number): Promise<void> {
    const quiz = await this.getFullQuiz(id);
    await this.quizzesRepository.remove(quiz);
  }

  async addQuestions(
    id: number,
    addQuestionsDto: AddQuestionsDto,
  ): Promise<Quiz> {
    await this.getFullQuiz(id); // Verify quiz exists

    // Add new questions with their order
    const quizQuestions = addQuestionsDto.questions.map((q) =>
      this.quizQuestionsRepository.create({
        quiz_id: id,
        question_id: q.question_id,
        question_order: q.order,
      }),
    );

    await this.quizQuestionsRepository.save(quizQuestions);
    return this.getFullQuiz(id);
  }

  async matchQuestionsToQuiz(
    quizId: number,
    questionIds: number[],
  ): Promise<Quiz> {
    await this.getFullQuiz(quizId); // Verify quiz exists

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
    return this.getFullQuiz(quizId);
  }

  async getQuestionsByQuizId(quizId: number): Promise<Question[]> {
    await this.getFullQuiz(quizId); // Verify quiz exists
    const quizQuestions = await this.quizQuestionsRepository.find({
      where: { quiz_id: quizId },
      relations: ['question'],
      order: { question_order: 'ASC' },
    });

    return quizQuestions.map((qq) => qq.question);
  }

  async addQuestionsByType(
    id: number,
    addQuestionsByTypeDto: AddQuestionsByTypeDto,
  ): Promise<Quiz> {
    const quiz = await this.getFullQuiz(id);
    const { type } = addQuestionsByTypeDto;

    // Get all questions of the specified type
    const questionsOfType = await this.questionRepository.find({
      where: { type },
    });

    // Create quiz-question relationships with sequential order
    const quizQuestions = questionsOfType.map((question, index) =>
      this.quizQuestionsRepository.create({
        quiz_id: id,
        question_id: question.id,
        question_order: index + 1,
      }),
    );

    await this.quizQuestionsRepository.save(quizQuestions);
    return this.getFullQuiz(id);
  }
}
