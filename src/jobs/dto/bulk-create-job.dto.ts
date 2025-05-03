import { IsArray, ValidateNested } from 'class-validator';
import { Type } from 'class-transformer';
import { CreateJobDto } from './create-job.dto';

export class BulkCreateJobDto {
  @IsArray()
  @ValidateNested({ each: true })
  @Type(() => CreateJobDto)
  jobs: CreateJobDto[];
}
