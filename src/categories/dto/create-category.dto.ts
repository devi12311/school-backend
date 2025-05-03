import { IsEnum } from 'class-validator';
import { CategoryType } from '../../entities/category.entity';

export class CreateCategoryDto {
  @IsEnum(CategoryType)
  type: CategoryType;
}
