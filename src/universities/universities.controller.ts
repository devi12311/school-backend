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
import { UniversitiesService } from './universities.service';
import { CreateUniversityDto } from './dto/create-university.dto';
import { UpdateUniversityDto } from './dto/update-university.dto';
import { BulkCreateUniversityDto } from './dto/bulk-create-university.dto';
import { UniversityResponseDto } from './dto/university-response.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { University } from '../entities/university.entity';

@Controller('universities')
@UseGuards(JwtAuthGuard)
@UseInterceptors(ClassSerializerInterceptor)
export class UniversitiesController {
  constructor(private readonly universitiesService: UniversitiesService) {}

  @Post()
  async create(
    @Body() createUniversityDto: CreateUniversityDto,
  ): Promise<ApiResponse<UniversityResponseDto>> {
    const data = await this.universitiesService.create(createUniversityDto);
    return {
      data,
      message: 'University created successfully',
      status: 201,
    };
  }

  @Post('bulk')
  async bulkCreate(
    @Body() bulkCreateUniversityDto: BulkCreateUniversityDto,
  ): Promise<ApiResponse<UniversityResponseDto[]>> {
    const data = await this.universitiesService.bulkCreate(
      bulkCreateUniversityDto,
    );
    return {
      data,
      message: 'Universities created successfully',
      status: 201,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<UniversityResponseDto[]>> {
    const data = await this.universitiesService.findAll();
    return {
      data,
      message: 'Universities retrieved successfully',
      status: 200,
    };
  }

  @Get(':id')
  async findOne(
    @Param('id') id: string,
  ): Promise<ApiResponse<UniversityResponseDto>> {
    const data = await this.universitiesService.findOne(+id);
    return {
      data,
      message: 'University retrieved successfully',
      status: 200,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateUniversityDto: UpdateUniversityDto,
  ): Promise<ApiResponse<UniversityResponseDto>> {
    const data = await this.universitiesService.update(
      +id,
      updateUniversityDto,
    );
    return {
      data,
      message: 'University updated successfully',
      status: 200,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: null; message: string; status: number }> {
    await this.universitiesService.remove(+id);
    return {
      data: null,
      message: 'University deleted successfully',
      status: 200,
    };
  }
}
