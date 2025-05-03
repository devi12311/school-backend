import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  Query,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { QuizzesService } from './quizzes.service';
import { CreateQuizDto } from './dto/create-quiz.dto';
import { UpdateQuizDto } from './dto/update-quiz.dto';
import {
  AddQuestionsDto,
  AddQuestionsByTypeDto,
} from './dto/add-questions.dto';
import { BulkCreateQuizDto } from './dto/bulk-create-quiz.dto';
import { MatchQuestionsDto } from './dto/match-questions.dto';
import { QuizResponseDto } from './dto/quiz-response.dto';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Quiz, QuizType } from '../entities/quiz.entity';
import { Question } from '../entities/question.entity';

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

@Controller('quizzes')
@UseInterceptors(ClassSerializerInterceptor)
export class QuizzesController {
  constructor(private readonly quizzesService: QuizzesService) {}

  @Post()
  async create(
    @Body() createQuizDto: CreateQuizDto,
  ): Promise<ApiResponse<QuizResponseDto>> {
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
  ): Promise<ApiResponse<QuizResponseDto[]>> {
    const data = await this.quizzesService.bulkCreate(bulkCreateQuizDto);
    return {
      data,
      message: 'Quizzes created successfully',
      status: 201,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<QuizResponseDto[]>> {
    const data = await this.quizzesService.findAll();
    return {
      data,
      message: 'Quizzes retrieved successfully',
      status: 200,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<QuizResponseDto>> {
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
  ): Promise<ApiResponse<QuizResponseDto>> {
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
  ): Promise<ApiResponse<QuizResponseDto>> {
    const data = await this.quizzesService.addQuestions(+id, addQuestionsDto);
    return {
      data,
      message: 'Questions added successfully',
      status: 200,
    };
  }

  @Post(':id/questions/type')
  async addQuestionsByType(
    @Param('id') id: string,
    @Body() addQuestionsByTypeDto: AddQuestionsByTypeDto,
  ): Promise<ApiResponse<QuizResponseDto>> {
    const data = await this.quizzesService.addQuestionsByType(
      +id,
      addQuestionsByTypeDto,
    );
    return {
      data,
      message: 'Questions added successfully',
      status: 200,
    };
  }

  @Post(':id/questions/match')
  async matchQuestions(
    @Param('id') id: string,
    @Body() matchQuestionsDto: MatchQuestionsDto,
  ): Promise<ApiResponse<QuizResponseDto>> {
    const data = await this.quizzesService.matchQuestions(
      +id,
      matchQuestionsDto,
    );
    return {
      data,
      message: 'Questions matched successfully',
      status: 200,
    };
  }

  @Get(':id/questions')
  async getQuestionsByQuizId(
    @Param('id') id: string,
  ): Promise<ApiResponse<Question[]>> {
    const data = await this.quizzesService.getQuestionsByQuizId(+id);
    return {
      data,
      message: 'Questions retrieved successfully',
      status: 200,
    };
  }

  @Get('type/:type')
  async findByType(
    @Param('type') type: string,
  ): Promise<ApiResponse<QuizResponseDto[]>> {
    const data = await this.quizzesService.findByType(type as QuizType);
    return {
      data,
      message: 'Quizzes retrieved successfully',
      status: 200,
    };
  }
}
