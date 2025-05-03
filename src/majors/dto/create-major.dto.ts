import { IsString, IsArray, IsNumber } from 'class-validator';

export class CreateMajorDto {
  @IsString()
  name: string;

  @IsArray()
  @IsString({ each: true })
  tags: string[];

  @IsNumber()
  category_id: number;
}
