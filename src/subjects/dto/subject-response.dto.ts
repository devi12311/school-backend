import { Exclude } from 'class-transformer';

class MajorResponseDto {
  id: number;
  name: string;
}

class UniversityResponseDto {
  id: number;
  name: string;
  logo: string;
}

export class SubjectResponseDto {
  id: number;
  name: string;
  tags: string[];
  major: MajorResponseDto;
  university: UniversityResponseDto;

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
} 