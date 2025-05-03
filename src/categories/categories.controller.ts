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
import { CategoriesService } from './categories.service';
import { CreateCategoryDto } from './dto/create-category.dto';
import { UpdateCategoryDto } from './dto/update-category.dto';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Category } from '../entities/category.entity';

@Controller('categories')
@UseGuards(JwtAuthGuard)
export class CategoriesController {
  constructor(private readonly categoriesService: CategoriesService) {}

  @Post()
  async create(
    @Body() createCategoryDto: CreateCategoryDto,
  ): Promise<ApiResponse<Category>> {
    const data = await this.categoriesService.create(createCategoryDto);
    return {
      data,
      message: 'Category created successfully',
      status: 201,
    };
  }

  @Get()
  async findAll(): Promise<ApiResponse<Category[]>> {
    const data = await this.categoriesService.findAll();
    return {
      data,
      message: 'Categories retrieved successfully',
      status: 200,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Category>> {
    const data = await this.categoriesService.findOne(+id);
    return {
      data,
      message: 'Category retrieved successfully',
      status: 200,
    };
  }

  @Patch(':id')
  async update(
    @Param('id') id: string,
    @Body() updateCategoryDto: UpdateCategoryDto,
  ): Promise<ApiResponse<Category>> {
    const data = await this.categoriesService.update(+id, updateCategoryDto);
    return {
      data,
      message: 'Category updated successfully',
      status: 200,
    };
  }

  @Delete(':id')
  async remove(
    @Param('id') id: string,
  ): Promise<{ data: null; message: string; status: number }> {
    await this.categoriesService.remove(+id);
    return {
      data: null,
      message: 'Category deleted successfully',
      status: 200,
    };
  }
}
