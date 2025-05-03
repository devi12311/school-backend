import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Progress } from '../entities/progress.entity';
import { UpdateProgressDto } from './dto/update-progress.dto';

@Injectable()
export class ProgressService {
  constructor(
    @InjectRepository(Progress)
    private progressRepository: Repository<Progress>,
  ) {}

  async create(userId: number): Promise<Progress> {
    const progress = this.progressRepository.create({
      user_id: userId,
      quiz_progress: {},
    });
    return this.progressRepository.save(progress);
  }

  async findOne(userId: number): Promise<Progress> {
    const progress = await this.progressRepository.findOne({
      where: { user_id: userId },
    });
    if (!progress) {
      throw new NotFoundException(`Progress for user with ID ${userId} not found`);
    }
    return progress;
  }

  async update(userId: number, updateProgressDto: UpdateProgressDto): Promise<Progress> {
    const progress = await this.findOne(userId);
    
    progress.quiz_progress = {
      ...progress.quiz_progress,
      [updateProgressDto.quiz_id]: {
        progress: updateProgressDto.progress,
        answered_questions: updateProgressDto.answered_questions,
        time_spent: updateProgressDto.time_spent,
        last_updated: updateProgressDto.last_updated,
      },
    };

    return this.progressRepository.save(progress);
  }

  async getQuizProgress(userId: number, quizId: number): Promise<{
    progress: number;
    answered_questions: number[];
    time_spent: number;
    last_updated: Date;
  } | null> {
    const progress = await this.findOne(userId);
    return progress.quiz_progress[quizId] || null;
  }
} 