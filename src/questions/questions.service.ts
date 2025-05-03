import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { BulkCreateQuestionDto } from './dto/bulk-create-question.dto';
import { QuestionResponseDto } from './dto/question-response.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async create(
    createQuestionDto: CreateQuestionDto,
  ): Promise<QuestionResponseDto> {
    const question = this.questionsRepository.create(createQuestionDto);
    const savedQuestion = await this.questionsRepository.save(question);
    return this.mapToResponseDto(savedQuestion);
  }

  async bulkCreate(
    bulkCreateQuestionDto: BulkCreateQuestionDto,
  ): Promise<QuestionResponseDto[]> {
    const questions = this.questionsRepository.create(
      bulkCreateQuestionDto.questions,
    );
    const savedQuestions = await this.questionsRepository.save(questions);
    return savedQuestions.map((question) => this.mapToResponseDto(question));
  }

  async findAll(): Promise<QuestionResponseDto[]> {
    const questions = await this.questionsRepository.find({
      relations: ['quizQuestions', 'quizQuestions.quiz'],
    });
    return questions.map((question) => this.mapToResponseDto(question));
  }

  async findOne(id: number): Promise<QuestionResponseDto> {
    const question = await this.questionsRepository.findOne({
      where: { id },
      relations: ['quizQuestions', 'quizQuestions.quiz'],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return this.mapToResponseDto(question);
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<QuestionResponseDto> {
    const question = await this.questionsRepository.findOne({
      where: { id },
      relations: ['quizQuestions', 'quizQuestions.quiz'],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    Object.assign(question, updateQuestionDto);
    await this.questionsRepository.save(question);
    return this.mapToResponseDto(question);
  }

  async remove(id: number): Promise<void> {
    const question = await this.questionsRepository.findOne({
      where: { id },
      relations: ['quizQuestions', 'quizQuestions.quiz'],
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    await this.questionsRepository.remove(question);
  }

  private mapToResponseDto(question: Question): QuestionResponseDto {
    const quiz = question.quizQuestions[0]?.quiz;
    return {
      id: question.id,
      question: question.question_text,
      options: question.properties
        .map((p) => p.answers.map((a) => a.answer))
        .flat(),
      correct_answer: question.properties[0]?.correct_answer?.answer || '',
      quiz: quiz
        ? {
            id: quiz.id,
            title: quiz.title,
          }
        : undefined,
      created_at: question.created_at,
      updated_at: question.updated_at,
    };
  }
}
