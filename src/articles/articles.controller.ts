import { Body, Controller, Get, Param, Post, UseGuards } from '@nestjs/common';
import { ArticlesService } from './articles.service';
import { JwtAuthGuard } from '../auth/jwt-auth.guard';
import { ApiResponse } from '../common/interfaces/api-response.interface';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { BulkCreateArticleDto } from './dto/bulk-create-article.dto';

@Controller('articles')
@UseGuards(JwtAuthGuard)
export class ArticlesController {
  constructor(private readonly articlesService: ArticlesService) {}

  @Post()
  async create(
    @Body() createArticleDto: CreateArticleDto,
  ): Promise<ApiResponse<Article>> {
    const data = await this.articlesService.create(createArticleDto);
    return {
      data,
      message: 'Article created successfully',
      status: 201,
    };
  }

  @Post('bulk')
  async bulkCreate(
    @Body() bulkCreateArticleDto: BulkCreateArticleDto,
  ): Promise<ApiResponse<Article[]>> {
    const data = await this.articlesService.bulkCreate(bulkCreateArticleDto);
    return {
      data,
      message: 'Articles created successfully',
      status: 201,
    };
  }

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
