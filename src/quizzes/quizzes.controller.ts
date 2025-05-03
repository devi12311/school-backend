import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import { AddQuestionsDto } from './dto/add-questions.dto';
import { BulkCreateQuizDto } from './dto/bulk-create-quiz.dto';
import { MatchQuestionsDto } from './dto/match-questions.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Quiz } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';

@Controller('quizzes')
@UseGuards(JwtAuthGuard)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async create(@Body() createQuizDto: CreateQuizDto): Promise<ApiResponse<Quiz>> {
    const data = await this.quizzesService.create(createQuizDto);
    return {
      data,
      message: 'Quiz created successfully',
      status: 201,
    };  
  }

  @Post('bulk')
  async bulkCreate(
    @Body() bulkCreateQuizDto: BulkCreateQuizDto,
  ): Promise<ApiResponse<Quiz[]>> {
    const data = await this.quizzesService.bulkCreate(bulkCreateQuizDto);
    return {
      data,
      message: 'Quizzes created successfully',
      status: 201,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<Quiz[]>> {
    const data = await this.quizzesService.findAll();
    return {
      data,
      message: 'Quizzes retrieved successfully',
      status: 200,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Quiz>> {
    const data = await this.quizzesService.findOne(+id);
    return {
      data,
      message: 'Quiz retrieved successfully',
      status: 200,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuizDto: UpdateQuizDto,
  ): Promise<ApiResponse<Quiz>> {
    const data = await this.quizzesService.update(+id, updateQuizDto);
    return {
      data,
      message: 'Quiz updated successfully',
      status: 200,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: null; message: string; status: number }> {
    await this.quizzesService.remove(+id);
    return {
      data: null,
      message: 'Quiz deleted successfully',
      status: 200,
    };
  }

  @Post(':id/questions')
  async addQuestions(
    @Param('id') id: string,
    @Body() addQuestionsDto: AddQuestionsDto,
  ): Promise<ApiResponse<Quiz>> {
    const data = await this.quizzesService.addQuestions(+id, addQuestionsDto);
    return {
      data,
      message: 'Questions added to quiz successfully',
      status: 200,
    };
  }

  @Post(':id/match-questions')
  async matchQuestions(
    @Param('id') id: string,
    @Body() matchQuestionsDto: MatchQuestionsDto,
  ): Promise<ApiResponse<Quiz>> {
    const quiz = await this.quizzesService.matchQuestionsToQuiz(
      +id,
      matchQuestionsDto.question_ids,
    );
    return {
      data: quiz,
      message: 'Questions matched to quiz successfully',
      status: 200,
    };
  }

  @Get(':id/questions')
  async getQuestionsByQuizId(
    @Param('id') id: string,
  ): Promise<ApiResponse<Question[]>> {
    const questions = await this.quizzesService.getQuestionsByQuizId(+id);
    return {
      data: questions,
      message: 'Questions retrieved successfully',
      status: 200,
    };
  }
} 