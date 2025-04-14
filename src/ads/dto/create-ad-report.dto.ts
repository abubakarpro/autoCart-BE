import { IsUUID, IsString } from 'class-validator';

export class CreateAdReportDto {
  @IsUUID()
  adId: string;

  @IsString()
  reason: string;
}