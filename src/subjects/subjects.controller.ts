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
import { SubjectsService } from './subjects.service';
import { CreateSubjectDto } from './dto/create-subject.dto';
import { UpdateSubjectDto } from './dto/update-subject.dto';
import { BulkCreateSubjectDto } from './dto/bulk-create-subject.dto';
import { SubjectResponseDto } from './dto/subject-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Subject } from '../entities/subject.entity';

@Controller('subjects')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class SubjectsController {
  constructor(private readonly subjectsService: SubjectsService) {}

  @Post()
  async create(
    @Body() createSubjectDto: CreateSubjectDto,
  ): Promise<ApiResponse<SubjectResponseDto>> {
    const data = await this.subjectsService.create(createSubjectDto);
    return {
      data,
      message: 'Subject created successfully',
      status: 201,
    };
  }

  @Post('bulk')
  async bulkCreate(
    @Body() bulkCreateSubjectDto: BulkCreateSubjectDto,
  ): Promise<ApiResponse<SubjectResponseDto[]>> {
    const data = await this.subjectsService.bulkCreate(bulkCreateSubjectDto);
    return {
      data,
      message: 'Subjects created successfully',
      status: 201,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<SubjectResponseDto[]>> {
    const data = await this.subjectsService.findAll();
    return {
      data,
      message: 'Subjects retrieved successfully',
      status: 200,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<SubjectResponseDto>> {
    const data = await this.subjectsService.findOne(+id);
    return {
      data,
      message: 'Subject retrieved successfully',
      status: 200,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateSubjectDto: UpdateSubjectDto,
  ): Promise<ApiResponse<SubjectResponseDto>> {
    const data = await this.subjectsService.update(+id, updateSubjectDto);
    return {
      data,
      message: 'Subject updated successfully',
      status: 200,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: null; message: string; status: number }> {
    await this.subjectsService.remove(+id);
    return {
      data: null,
      message: 'Subject deleted successfully',
      status: 200,
    };
  }
}
