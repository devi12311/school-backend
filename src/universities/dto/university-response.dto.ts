import { Exclude } from 'class-transformer';

class SubjectResponseDto {
  id: number;
  name: string;
  tags: string[];
}

class MajorResponseDto {
  id: number;
  name: string;
  tags: string[];
  subjects: SubjectResponseDto[];
}

export class UniversityResponseDto {
  id: number;
  name: string;
  description: string;
  location: string;
  website: string;
  ranking: string;
  acceptance_rate: string;
  logo: string;
  banner: string;
  email: string;
  tuition: string;
  majors: MajorResponseDto[];

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
