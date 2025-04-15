import { ApiProperty } from '@nestjs/swagger';
import { ReportCategory } from '@prisma/client';


import { IsUUID, IsString, IsEnum, IsOptional } from 'class-validator';

export class CreateAdReportDto {
  @ApiProperty({ description: 'Id of the AD', example: '67548f7f-6f18-41d5-bd2e-16ec7e4045f9' })
  @IsUUID()
  adId: string;

  @ApiProperty({ description: 'Reason of the Report', example: 'example-string' })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Category of the Report', example: 'GENERAL' })
  @IsOptional()
  @IsEnum(ReportCategory, { message: 'Invalid Report Category' })
  reportCategory?: ReportCategory;
}