import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Question } from '../entities/question.entity';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { BulkCreateQuestionDto } from './dto/bulk-create-question.dto';

@Injectable()
export class QuestionsService {
  constructor(
    @InjectRepository(Question)
    private questionsRepository: Repository<Question>,
  ) {}

  async create(createQuestionDto: CreateQuestionDto): Promise<Question> {
    const question = this.questionsRepository.create(createQuestionDto);
    return this.questionsRepository.save(question);
  }

  async bulkCreate(
    bulkCreateQuestionDto: BulkCreateQuestionDto,
  ): Promise<Question[]> {
    const questions = this.questionsRepository.create(
      bulkCreateQuestionDto.questions,
    );
    return this.questionsRepository.save(questions);
  }

  async findAll(): Promise<Question[]> {
    return this.questionsRepository.find();
  }

  async findOne(id: number): Promise<Question> {
    const question = await this.questionsRepository.findOne({
      where: { id },
    });
    if (!question) {
      throw new NotFoundException(`Question with ID ${id} not found`);
    }
    return question;
  }

  async update(
    id: number,
    updateQuestionDto: UpdateQuestionDto,
  ): Promise<Question> {
    const question = await this.findOne(id);
    Object.assign(question, updateQuestionDto);
    return this.questionsRepository.save(question);
  }

  async remove(id: number): Promise<void> {
    const question = await this.findOne(id);
    await this.questionsRepository.remove(question);
  }
}
