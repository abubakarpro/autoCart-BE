import { ReportCategory } from '@prisma/client';
import { IsUUID, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateAdReportDto {
  @IsUUID()
  adId: string;

  @IsString()
  reason: string;

  @IsOptional()
  @IsEnum(ReportCategory, { message: 'Invalid Report Category' })
  reportCategory?: ReportCategory;
}