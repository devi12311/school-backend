import { Controller, Get, Param, Query } from '@nestjs/common';
import { GorseService } from './gorse.service';

@Controller('recommendations')
export class RecommendationsController {
  constructor(private readonly gorseService: GorseService) {}

  @Get('majors/:userId')
  async getMajorRecommendations(
    @Param('userId') userId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.gorseService.getMajorRecommendations(userId, limit);
  }

  @Get('subjects/:userId')
  async getSubjectRecommendations(
    @Param('userId') userId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.gorseService.getSubjectRecommendations(userId, limit);
  }

  @Get('articles/:userId')
  async getArticleRecommendations(
    @Param('userId') userId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.gorseService.getArticleRecommendations(userId, limit);
  }

  @Get('jobs/:userId')
  async getJobRecommendations(
    @Param('userId') userId: string,
    @Query('limit') limit: number = 10,
  ) {
    return this.gorseService.getJobRecommendation(userId, limit);
  }
}
