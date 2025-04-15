import { ReportCategory } from '@prisma/client';
import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';

export class CreateStoryReportDto {
  @IsString()
  @IsNotEmpty()
  storyId: string;

  @IsOptional()
  @IsEnum(ReportCategory, { message: 'Invalid Report Category' })
  reportCategory?: ReportCategory;

  @IsString()
  @IsNotEmpty()
  reason: string;
}
