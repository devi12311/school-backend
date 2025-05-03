import { IsEnum, IsOptional } from 'class-validator';
import { CategoryType } from '../../entities/category.entity';

export class UpdateCategoryDto {
  @IsEnum(CategoryType)
  @IsOptional()
  type?: CategoryType;
}
