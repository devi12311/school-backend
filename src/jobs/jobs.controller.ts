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
import { JobsService } from './jobs.service';
import { CreateJobDto } from './dto/create-job.dto';
import { UpdateJobDto } from './dto/update-job.dto';
import { BulkCreateJobDto } from './dto/bulk-create-job.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Job } from '../entities/job.entity';

@Controller('jobs')
@UseGuards(JwtAuthGuard)
export class JobsController {
  constructor(private readonly jobsService: JobsService) {}

  @Post()
  async create(@Body() createJobDto: CreateJobDto): Promise<ApiResponse<Job>> {
    const data = await this.jobsService.create(createJobDto);
    return {
      data,
      message: 'Job created successfully',
      status: 201,
    };
  }

  @Post('bulk')
  async bulkCreate(
    @Body() bulkCreateJobDto: BulkCreateJobDto,
  ): Promise<ApiResponse<Job[]>> {
    const data = await this.jobsService.bulkCreate(bulkCreateJobDto);
    return {
      data,
      message: 'Jobs created successfully',
      status: 201,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<Job[]>> {
    const data = await this.jobsService.findAll();
    return {
      data,
      message: 'Jobs retrieved successfully',
      status: 200,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Job>> {
    const data = await this.jobsService.findOne(+id);
    return {
      data,
      message: 'Job retrieved successfully',
      status: 200,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateJobDto: UpdateJobDto,
  ): Promise<ApiResponse<Job>> {
    const data = await this.jobsService.update(+id, updateJobDto);
    return {
      data,
      message: 'Job updated successfully',
      status: 200,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: null; message: string; status: number }> {
    await this.jobsService.remove(+id);
    return {
      data: null,
      message: 'Job deleted successfully',
      status: 200,
    };
  }
}
