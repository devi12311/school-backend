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
import { MajorsService } from './majors.service';
import { CreateMajorDto } from './dto/create-major.dto';
import { UpdateMajorDto } from './dto/update-major.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Major } from '../entities/major.entity';
import { BulkCreateMajorDto } from './dto/bulk-create-major.dto';

@Controller('majors')
@UseGuards(JwtAuthGuard)
export class MajorsController {
  constructor(private readonly majorsService: MajorsService) {}

  @Post()
  async create(
    @Body() createMajorDto: CreateMajorDto,
  ): Promise<ApiResponse<Major>> {
    const data = await this.majorsService.create(createMajorDto);
    return {
      data,
      message: 'Major created successfully',
      status: 201,
    };
  }

  @Post('bulk')
  async bulkCreate(
    @Body() bulkCreateMajorDto: BulkCreateMajorDto,
  ): Promise<ApiResponse<Major[]>> {
    const data = await this.majorsService.bulkCreate(bulkCreateMajorDto);
    return {
      data,
      message: 'Majors created successfully',
      status: 201,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<Major[]>> {
    const data = await this.majorsService.findAll();
    return {
      data,
      message: 'Majors retrieved successfully',
      status: 200,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Major>> {
    const data = await this.majorsService.findOne(+id);
    return {
      data,
      message: 'Major retrieved successfully',
      status: 200,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateMajorDto: UpdateMajorDto,
  ): Promise<ApiResponse<Major>> {
    const data = await this.majorsService.update(+id, updateMajorDto);
    return {
      data,
      message: 'Major updated successfully',
      status: 200,
    };
  }

  @Delete(':id')
  async remove(@Param('id') id: string): Promise<ApiResponse<undefined>> {
    await this.majorsService.remove(+id);
    return {
      data: undefined,
      message: 'Major deleted successfully',
      status: 200,
    };
  }
}
