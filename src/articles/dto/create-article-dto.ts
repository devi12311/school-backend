import {
  IsString,
  IsNotEmpty,
  IsArray,
  IsInt,
  IsUrl,
  IsJSON,
} from 'class-validator';

export class CreateArticleDto {
  @IsString()
  @IsNotEmpty()
  name: string;

  @IsArray()
  @IsString({ each: true })
  @IsNotEmpty({ each: true })
  tags: string[];

  @IsString()
  @IsUrl()
  @IsNotEmpty()
  url: string;

  @IsInt()
  @IsNotEmpty()
  category_id: number;

  @IsJSON()
  @IsNotEmpty()
  info: any;
}
