import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { BulkCreateArticleDto } from './dto/bulk-create-article.dto';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articlesRepository.create(createArticleDto);
    return this.articlesRepository.save(article);
  }

  async bulkCreate(
    bulkCreateArticleDto: BulkCreateArticleDto,
  ): Promise<Article[]> {
    const articles = this.articlesRepository.create(
      bulkCreateArticleDto.articles,
    );
    return this.articlesRepository.save(articles);
  }

  async findAll(): Promise<Article[]> {
    return this.articlesRepository.find({
      relations: ['category'],
    });
  }

  async findOne(id: number): Promise<Article> {
    const article = await this.articlesRepository.findOne({
      where: { id },
      relations: ['category'],
    });
    if (!article) {
      throw new NotFoundException(`Article with ID ${id} not found`);
    }
    return article;
  }
}
