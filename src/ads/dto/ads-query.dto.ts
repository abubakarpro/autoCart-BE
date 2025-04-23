import { IsOptional, IsEnum, IsString, IsNumber } from 'class-validator';

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
  status?: AdStatus;

  @IsOptional()
  @IsString()
  itemName?: string;

  @IsOptional()
  @IsString()
  location?: string;

  @IsOptional()
  @IsString()
  countryOfRegistration?: string;

  @IsOptional()
  @IsString()
  categoryId?: string;

  @IsOptional()
  @IsNumber()
  minYear?: number;

  @IsOptional()
  @IsNumber()
  maxYear?: number;

  @IsOptional()
  @IsNumber()
  minPrice?: number;

  @IsOptional()
  @IsNumber()
  maxPrice?: number;

  @IsOptional()
  @IsNumber()
  minMileage?: number;

  @IsOptional()
  @IsNumber()
  maxMileage?: number;
}