import { IsOptional, IsEnum } from 'class-validator';

export enum AdStatus {
  NEW = 'NEW',
  USED = 'USED',
  ACTIVE = 'ACTIVE',
  EXPIRED = 'EXPIRED',
  PENDING = 'PENDING',
  REJECTED = 'REJECTED',
}

export class AdQueryDto {
  @IsOptional()
  @IsEnum(AdStatus, { message: 'Invalid ad status' })
  adStatus?: AdStatus;
}