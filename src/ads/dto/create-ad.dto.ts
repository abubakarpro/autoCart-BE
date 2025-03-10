import { IsString, IsEnum, IsArray, IsOptional, IsNumber, IsDateString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { AdStatus, ItemCondition, AdType, PriceCurrency} from "@prisma/client";

export class CreateAdDto {
  @ApiProperty({ description: 'ID of the Category', example: 1 })
  @IsString()
  categoryId: string;

  @ApiProperty({ description: 'ID of the user', example: 1 })
  @IsOptional()
  userId: string;

  @ApiProperty({ description: 'Images for Ad', example: ['image1.jpg', 'image2.jpg'] })
  @IsArray()
  uploadImagesForAd: string[];

  @ApiProperty({ description: 'Images for Story', example: ['story1.jpg', 'story2.jpg'] })
  @IsArray()
  uploadImagesForStory: string[];

  @ApiProperty({ description: 'Vehicle License Number (Optional)', example: 'ABC-123', required: false })
  @IsOptional()
  @IsString()
  vehicleLicenseNumber?: string;

  @ApiProperty({ description: 'Name of the Item', example: 'iPhone 13' })
  @IsString()
  itemName: string;

  @ApiProperty({ description: 'Status of the Ad', enum: AdStatus })
  @IsEnum(AdStatus)
  status: AdStatus;

  @ApiProperty({ description: 'Condition of the Item', enum: ItemCondition })
  @IsEnum(ItemCondition)
  condition: ItemCondition;

  @ApiProperty({ description: 'Type of the Ad', enum: AdType })
  @IsEnum(AdType)
  adType: AdType;

  @ApiProperty({ description: 'Phone Number of the Seller', example: '+1234567890' })
  @IsString()
  phoneNumber: string;

  @ApiProperty({ description: 'Location of the Ad', example: 'London, UK' })
  @IsString()
  location: string;

  @ApiProperty({ description: 'Price of the Item', example: 500 })
  @IsNumber()
  price: number;

  @ApiProperty({ description: 'Currency of the Price', enum: PriceCurrency })
  @IsEnum(PriceCurrency)
  priceCurrency: PriceCurrency;

  @ApiProperty({ description: 'Description of the Ad', example: 'Brand new iPhone 13, never used.' })
  @IsString()
  descriptions: string;

  @ApiProperty({ description: 'Start date of the Ad', example: '2024-03-15T00:00:00Z' })
  @IsDateString()
  @IsOptional()
  createDate: any;
}
