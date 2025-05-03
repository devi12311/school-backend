import { Exclude } from 'class-transformer';

class SubjectResponseDto {
  id: number;
  name: string;
  tags: string[];
}

class UniversityResponseDto {
  id: number;
  name: string;
  logo: string;
}

export class MajorResponseDto {
  id: number;
  name: string;
  tags: string[];
  university: UniversityResponseDto;
  subjects: SubjectResponseDto[];

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
} 