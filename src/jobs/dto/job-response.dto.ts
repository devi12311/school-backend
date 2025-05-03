import { Exclude } from 'class-transformer';

class CategoryResponseDto {
  id: number;
  name: string;
}

export class JobResponseDto {
  id: number;
  title: string;
  description: string;
  company: string;
  location: string;
  salary: string;
  requirements: string[];
  benefits: string[];
  category: CategoryResponseDto;
  application_url: string;
  logo: string;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
