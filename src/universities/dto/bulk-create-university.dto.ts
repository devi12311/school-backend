import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateUniversityDto } from './create-university.dto';

export class BulkCreateUniversityDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateUniversityDto)
  universities: CreateUniversityDto[];
}
