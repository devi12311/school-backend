import {
  IsString,
  IsNumber,
  IsArray,
  IsOptional,
  IsUrl,
} from 'class-validator';

export class CreateJobDto {
  @IsString()
  title: string;

  @IsString()
  excerpt: string;

  @IsString()
  companyName: string;

  @IsUrl()
  companyLogo: string;

  @IsString()
  employmentType: string;

  @IsNumber()
  @IsOptional()
  minSalary?: number;

  @IsNumber()
  @IsOptional()
  maxSalary?: number;

  @IsArray()
  @IsString({ each: true })
  seniority: string[];

  @IsArray()
  @IsString({ each: true })
  locationRestrictions: string[];

  @IsArray()
  @IsNumber({}, { each: true })
  timezoneRestrictions: number[];

  @IsArray()
  @IsString({ each: true })
  categories: string[];

  @IsArray()
  @IsString({ each: true })
  parentCategories: string[];

  @IsString()
  description: string;

  @IsNumber()
  pubDate: number;

  @IsNumber()
  expiryDate: number;

  @IsUrl()
  applicationLink: string;

  @IsString()
  guid: string;
}
