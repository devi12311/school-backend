import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateSubjectDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNumber()
  category_id: number;

  @IsNumber()
  major_id: number;
}
