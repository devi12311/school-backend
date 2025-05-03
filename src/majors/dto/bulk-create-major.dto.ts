import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateMajorDto } from './create-major.dto';

export class BulkCreateMajorDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateMajorDto)
  majors: CreateMajorDto[];
}
