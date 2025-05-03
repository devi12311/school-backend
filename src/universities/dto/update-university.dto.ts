import { IsString, IsOptional } from 'class-validator';

export class UpdateUniversityDto {
  @IsString()
  @IsOptional()
  name?: string;
}
