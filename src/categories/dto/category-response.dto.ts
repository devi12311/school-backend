import { Exclude } from 'class-transformer';

export class CategoryResponseDto {
  id: number;
  name: string;
  description: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
} 