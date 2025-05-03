import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  UseGuards,
  Request,
} from '@nestjs/common';
import { ProgressService } from './progress.service';
import { UpdateProgressDto } from './dto/update-progress.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Progress } from '../entities/progress.entity';

@Controller('progress')
@UseGuards(JwtAuthGuard)
export class ProgressController {
  constructor(private readonly progressService: ProgressService) {}

  @Post()
  async create(@Request() req): Promise<ApiResponse<Progress>> {
    const data = await this.progressService.create(req.user.id);
    return {
      data,
      message: 'Progress record created successfully',
      status: 201,
    };
  }

  @Get()
  async findOne(@Request() req): Promise<ApiResponse<Progress>> {
    const data = await this.progressService.findOne(req.user.id);
    return {
      data,
      message: 'Progress retrieved successfully',
      status: 200,
    };
  }

  @Post('update')
  async update(
    @Request() req,
    @Body() updateProgressDto: UpdateProgressDto,
  ): Promise<ApiResponse<Progress>> {
    const data = await this.progressService.update(
      req.user.id,
      updateProgressDto,
    );
    return {
      data,
      message: 'Progress updated successfully',
      status: 200,
    };
  }

  @Get('quiz/:quizId')
  async getQuizProgress(
    @Request() req,
    @Param('quizId') quizId: string,
  ): Promise<ApiResponse<any>> {
    const data = await this.progressService.getQuizProgress(
      req.user.id,
      +quizId,
    );
    return {
      data,
      message: 'Quiz progress retrieved successfully',
      status: 200,
    };
  }
}
