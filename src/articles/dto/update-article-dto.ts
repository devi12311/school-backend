import {
  IsString,
  IsArray,
  IsInt,
  IsUrl,
  IsOptional,
  IsNotEmpty,
} from 'class-validator';

export class UpdateArticleDto {
  @IsString()
  @IsNotEmpty()
  @IsOptional()
  name?: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  @IsOptional()
  tags?: string[];

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  @IsOptional()
  url?: string;

  @IsInt()
  @IsOptional()
  category_id?: number;
}
