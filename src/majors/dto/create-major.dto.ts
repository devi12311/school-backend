import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateMajorDto {
  @IsString()
  name: string;

  @IsNumber()
  id?: number;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNumber()
  category_id: number;

  @IsNumber()
  university_id: number;
}
