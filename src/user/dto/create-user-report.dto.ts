import { ApiProperty } from '@nestjs/swagger';
import { ReportCategory } from '@prisma/client';
import { IsUUID, IsString, IsOptional, IsEnum } from 'class-validator';

export class CreateUserReportDto {
  @ApiProperty({ description: 'Id of the User', example: '67548f7f-6f18-41d5-bd2e-16ec7e4045f9' })
  @IsUUID()
  reportedUserId: string;

  @ApiProperty({ description: 'Reason of the Report', example: 'example_string' })
  @IsString()
  reason: string;

  @ApiProperty({ description: 'Report Category', example: 'GENERAL' })
  @IsOptional()
  @IsEnum(ReportCategory, { message: 'Invalid Report Category' })
  reportCategory?: ReportCategory;
}
