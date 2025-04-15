import { ReportCategory } from '@prisma/client';
import { IsUUID, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateUserReportDto {
  @IsUUID()
  reportedUserId: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsEnum(ReportCategory, { message: 'Invalid Report Category' })
  reportCategory?: ReportCategory;
}