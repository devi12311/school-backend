import { IsString, IsArray, IsNumber, IsOptional } from 'class-validator';

export class UpdateJobDto {
  @IsString()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsOptional()
  tags?: string[];

  @IsNumber()
  @IsOptional()
  category_id?: number;
}
