import { Exclude } from 'class-transformer';

class MajorDto {
  name: string;
  subjects: string[];
}

class UniversityDto {
  name: string;
  description: string;
  location: string;
  website: string;
  ranking: number;
  acceptance_rate: number;
  logo: string;
  banner: string;
  score: number;
  majors: Partial<MajorDto>[];
}

export class MajorRecommendationDto {
  universities: UniversityDto[];

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
