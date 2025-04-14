import { IsUUID, IsString } from 'class-validator';

export class CreateUserReportDto {
  @IsUUID()
  reportedUserId: string;

  @IsString()
  reason: string;
}