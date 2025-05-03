import { Exclude } from 'class-transformer';

class CategoryResponseDto {
  id: number;
  name: string;
}

export class ArticleResponseDto {
  id: number;
  title: string;
  content: string;
  category: CategoryResponseDto;
  author: string;
  image_url: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
