import { Exclude } from 'class-transformer';

class SubjectResponseDto {
  name: string;
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
  duration: string;
  job_placement_rate: string;
  average_salary: string;
  university: UniversityResponseDto;
  subjects: SubjectResponseDto[];

  @Exclude()
  created_at: Date;

  @Exclude()
  updated_at: Date;
}
