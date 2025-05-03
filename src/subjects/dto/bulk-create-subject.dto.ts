import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateSubjectDto } from './create-subject.dto';

export class BulkCreateSubjectDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateSubjectDto)
  subjects: CreateSubjectDto[];
}
