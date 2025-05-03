import {
  Controller,
  Get,
  Post,
  Body,
  Patch,
  Param,
  Delete,
  UseGuards,
  UseInterceptors,
  ClassSerializerInterceptor,
} from '@nestjs/common';
import { QuestionsService } from './questions.service';
import { CreateQuestionDto } from './dto/create-question.dto';
import { UpdateQuestionDto } from './dto/update-question.dto';
import { BulkCreateQuestionDto } from './dto/bulk-create-question.dto';
import { QuestionResponseDto } from './dto/question-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Question } from '../entities/question.entity';

@Controller('questions')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class QuestionsController {
  constructor(private readonly questionsService: QuestionsService) {}

  @Post()
  async create(
    @Body() createQuestionDto: CreateQuestionDto,
  ): Promise<ApiResponse<QuestionResponseDto>> {
    const data = await this.questionsService.create(createQuestionDto);
    return {
      data,
      message: 'Question created successfully',
      status: 201,
    };
  }

  @Post('bulk')
  async bulkCreate(
    @Body() bulkCreateQuestionDto: BulkCreateQuestionDto,
  ): Promise<ApiResponse<QuestionResponseDto[]>> {
    const data = await this.questionsService.bulkCreate(bulkCreateQuestionDto);
    return {
      data,
      message: 'Questions created successfully',
      status: 201,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<QuestionResponseDto[]>> {
    const data = await this.questionsService.findAll();
    return {
      data,
      message: 'Questions retrieved successfully',
      status: 200,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<QuestionResponseDto>> {
    const data = await this.questionsService.findOne(+id);
    return {
      data,
      message: 'Question retrieved successfully',
      status: 200,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateQuestionDto: UpdateQuestionDto,
  ): Promise<ApiResponse<QuestionResponseDto>> {
    const data = await this.questionsService.update(+id, updateQuestionDto);
    return {
      data,
      message: 'Question updated successfully',
      status: 200,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: null; message: string; status: number }> {
    await this.questionsService.remove(+id);
    return {
      data: null,
      message: 'Question deleted successfully',
      status: 200,
    };
  }
}
