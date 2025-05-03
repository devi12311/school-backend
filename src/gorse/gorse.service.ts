import { Injectable } from '@nestjs/common';
import { Gorse, DateTime } from 'gorsejs';
import { ConfigService } from '@nestjs/config';

@Injectable()
export class GorseService {
  private client: Gorse<any>;

  constructor(private configService: ConfigService) {
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
