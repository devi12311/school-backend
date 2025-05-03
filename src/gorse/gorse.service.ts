import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Gorse, DateTime } from 'gorsejs';
import { ConfigService } from '@nestjs/config';
import { MajorsService } from '../majors/majors.service';
import { SubjectsService } from '../subjects/subjects.service';
import { ArticlesService } from '../articles/articles.service';
import { MajorRecommendationDto } from './dto/major-recommendation.dto';
import { SubjectRecommendationDto } from './dto/subject-recommendation.dto';
import { ArticleRecommendationDto } from './dto/article-recommendation.dto';
import { Major } from '../entities/major.entity';

@Injectable()
export class GorseService {
  private client: Gorse<any>;

  constructor(
    private configService: ConfigService,
    @Inject(forwardRef(() => MajorsService))
    private majorsService: MajorsService,
    @Inject(forwardRef(() => SubjectsService))
    private subjectsService: SubjectsService,
    @Inject(forwardRef(() => ArticlesService))
    private articlesService: ArticlesService,
  ) {
    this.client = new Gorse({
      endpoint: this.configService.get(
        'GORSE_ENDPOINT',
        'http://127.0.0.1:8087',
      ),
      secret: this.configService.get('GORSE_API_KEY', 'api_key'),
    });
  }

  async insertFeedback(feedback: {
    FeedbackType: string;
    UserId: string;
    ItemId: string;
    Timestamp?: DateTime;
  }) {
    return this.client.insertFeedbacks([
      {
        ...feedback,
        Timestamp: feedback.Timestamp || new Date().toISOString(),
      },
    ]);
  }

  async insertFeedbacks(
    feedbacks: Array<{
      FeedbackType: string;
      UserId: string;
      ItemId: string;
      Timestamp?: DateTime;
    }>,
  ) {
    return this.client.insertFeedbacks(
      feedbacks.map((feedback) => ({
        ...feedback,
        Timestamp: feedback.Timestamp || new Date().toISOString(),
      })),
    );
  }

  async getRecommendations(userId: string, n: number = 10) {
    return this.client.getRecommend({ userId, cursorOptions: { n } });
  }

  private parseIds(items: string[]): number[] {
    return items.map((item) => {
      const [, id] = item.split(':');
      return parseInt(id, 10);
    });
  }

  async getMajorRecommendations(
    userId: string,
    n: number = 10,
  ): Promise<MajorRecommendationDto[]> {
    const response = await this.client.getRecommend({
      userId,
      cursorOptions: { n },
      category: '1',
    });
    if (!response || !Array.isArray(response)) {
      return [];
    }
    const ids = this.parseIds(response);
    const majors = await this.majorsService.findMany(ids);
    return majors.map((major) => ({
      name: major.name,
      subjects: major.subjects.map((subject) => subject.name),
    }));
  }

  async getSubjectRecommendations(
    userId: string,
    n: number = 10,
  ): Promise<SubjectRecommendationDto[]> {
    const response = await this.client.getRecommend({
      userId,
      cursorOptions: { n },
      category: '4',
    });
    if (!response || !Array.isArray(response)) {
      return [];
    }
    const ids = this.parseIds(response);
    const subjects = await this.subjectsService.findMany(ids);
    return subjects.map((subject) => ({
      name: subject.name,
      major: subject.major as unknown as Major,
    }));
  }

  async getArticleRecommendations(
    userId: string,
    n: number = 10,
  ): Promise<ArticleRecommendationDto[]> {
    const response = await this.client.getRecommend({
      userId,
      cursorOptions: { n },
      category: '2',
    });
    if (!response || !Array.isArray(response)) {
      return [];
    }
    const ids = this.parseIds(response);
    const articles = await this.articlesService.findMany(ids);
    return articles.map((article) => ({
      name: article.name,
      url: article.url,
    }));
  }

  async insertItem(item: {
    ItemId: string;
    IsHidden: boolean;
    Categories: string[];
    Timestamp: DateTime;
    Labels: string[];
    Comment: string;
  }) {
    return this.client.upsertItem({
      ...item,
      Timestamp: item.Timestamp || new Date().toISOString(),
    });
  }

  async insertItems(
    items: Array<{
      ItemId: string;
      IsHidden: boolean;
      Categories: string[];
      Timestamp: DateTime;
      Labels: string[];
      Comment: string;
    }>,
  ) {
    return this.client.upsertItems(
      items.map((item) => ({
        ...item,
        Timestamp: item.Timestamp || new Date().toISOString(),
      })),
    );
  }
}
