import { Injectable, Inject, forwardRef } from '@nestjs/common';
import { Gorse, DateTime } from 'gorsejs';
import { ConfigService } from '@nestjs/config';
import { MajorsService } from '../majors/majors.service';
import { SubjectsService } from '../subjects/subjects.service';
import { ArticlesService } from '../articles/articles.service';
import { SubjectRecommendationDto } from './dto/subject-recommendation.dto';
import { ArticleRecommendationDto } from './dto/article-recommendation.dto';
import { Major } from '../entities/major.entity';
import { MajorResponseDto } from '../majors/dto/major-response.dto';
import { JobsService } from '../jobs/jobs.service';
import { Job } from '../entities/job.entity';

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
    @Inject(forwardRef(() => JobsService))
    private jobsService: JobsService,
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
  ): Promise<{
    universities: {
      score: number;
      website: any;
      majors: Array<Partial<MajorResponseDto>>;
      name: any;
      description: any;
      acceptance_rate: any;
      logo: any;
      banner: any;
      location: any;
      ranking: any;
      tuition: any;
      email: any;
    }[];
    updated_at: Date;
    created_at: Date;
  }> {
    const response = await this.client.getRecommend({
      userId,
      cursorOptions: { n },
      category: '1',
    });
    if (!response || !Array.isArray(response)) {
      return {
        universities: [],
        created_at: new Date(),
        updated_at: new Date(),
      };
    }
    const ids = this.parseIds(response);
    const majors = await this.majorsService.findMany(ids);
    const totalMajors: number = majors.length;

    // Group majors by university and calculate scores
    const universityMap = new Map<
      number,
      {
        university: any;
        majors: Array<Partial<MajorResponseDto>>;
        score: number;
      }
    >();

    majors.forEach((major) => {
      if (!major.university_id) return;

      const universityId = major.university.id;
      const majorDto: Partial<MajorResponseDto> = {
        name: major.name,
        subjects: major.subjects.map((subject) => ({ name: subject.name })),
        duration: major.duration,
        job_placement_rate: major.job_placement_rate,
        average_salary: major.average_salary,
      };

      if (!universityMap.has(universityId)) {
        universityMap.set(universityId, {
          university: major.university,
          majors: [majorDto],
          score: 1,
        });
      } else {
        const entry = universityMap.get(universityId);
        if (entry) {
          entry.majors.push(majorDto);
          entry.score += 1;
        }
      }
    });

    // Convert to the required format
    const universities = Array.from(universityMap.values())
      .map(({ university, majors, score }) => ({
        name: university.name,
        description: university.description,
        location: university.location,
        website: university.website,
        ranking: university.ranking,
        acceptance_rate: university.acceptance_rate,
        logo: university.logo,
        banner: university.banner,
        email: university.email,
        tuition: university.tuition,
        score: score / totalMajors,
        majors,
      }))
      .sort((a, b) => b.score - a.score); // Sort by score descending

    return {
      universities,
      created_at: new Date(),
      updated_at: new Date(),
    };
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
      tags: article.tags,
      info: article.info,
    }));
  }

  async getJobRecommendation(userId: string, n: number = 10): Promise<Job[]> {
    const response = await this.client.getRecommend({
      userId,
      cursorOptions: { n },
      category: '3',
    });
    if (!response || !Array.isArray(response)) {
      return [];
    }
    const ids = this.parseIds(response);
    return await this.jobsService.findMany(ids);
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
