import {
  forwardRef,
  Inject,
  Injectable,
  NotFoundException,
} from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository, In } from 'typeorm';
import { Article } from '../entities/article.entity';
import { CreateArticleDto } from './dto/create-article-dto';
import { BulkCreateArticleDto } from './dto/bulk-create-article.dto';
import { GorseService } from '../gorse/gorse.service';

@Injectable()
export class ArticlesService {
  constructor(
    @InjectRepository(Article)
    private articlesRepository: Repository<Article>,
    @Inject(forwardRef(() => GorseService))
    private gorseService: GorseService,
  ) {}

  async create(createArticleDto: CreateArticleDto): Promise<Article> {
    const article = this.articlesRepository.create(createArticleDto);
    const savedArticle = await this.articlesRepository.save(article);

    // Insert into Gorse
    await this.gorseService.insertItem({
      ItemId: `article:${savedArticle.id}`,
      IsHidden: false,
      Categories: ['2'], // Using category 2 for articles
      Timestamp: new Date().toISOString(),
      Labels: savedArticle.tags,
      Comment: savedArticle.name,
    });

    return savedArticle;
  }

  async bulkCreate(
    bulkCreateArticleDto: BulkCreateArticleDto,
  ): Promise<Article[]> {
    const articles = this.articlesRepository.create(
      bulkCreateArticleDto.articles,
    );
    const savedArticles = await this.articlesRepository.save(articles);

    // Insert into Gorse
    const gorseItems = savedArticles.map((article) => ({
      ItemId: `article:${article.id}`,
      IsHidden: false,
      Categories: ['2'], // Using category 2 for articles
      Timestamp: new Date().toISOString(),
      Labels: article.tags,
      Comment: article.name,
    }));

    await this.gorseService.insertItems(gorseItems);

    return savedArticles;
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

  async findMany(ids: number[]): Promise<Article[]> {
    return this.articlesRepository.find({
      where: { id: In(ids) },
    });
  }
}
