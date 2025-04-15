import { IsEnum, IsNotEmpty, IsOptional, IsString } from 'class-validator';
import { ReportCategory } from '@prisma/client';

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
