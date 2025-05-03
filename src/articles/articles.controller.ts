import { Controller, Get, Param, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Article } from '../entities/article.entity';

@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Get()
  async findAll(): Promise<ApiResponse<Article[]>> {
    const data = await this.articlesService.findAll();
    return {
      data,
      message: 'Articles retrieved successfully',
      status: 200,
    };
  }

  @Get(':id')
  async findOne(@Param('id') id: string): Promise<ApiResponse<Article>> {
    const data = await this.articlesService.findOne(+id);
    return {
      data,
      message: 'Article retrieved successfully',
      status: 200,
    };
  }
} 