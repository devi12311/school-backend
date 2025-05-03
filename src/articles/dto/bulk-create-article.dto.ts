import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateArticleDto } from './create-article-dto';

export class BulkCreateArticleDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateArticleDto)
  articles: CreateArticleDto[];
}
