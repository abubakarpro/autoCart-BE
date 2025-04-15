import { ApiProperty } from '@nestjs/swagger';
import { IsOptional, IsArray } from 'class-validator';

export class CreateStoryDto {
  @ApiProperty({
    description: 'Images for Story',
    example: ['story1.jpg', 'story2.jpg'],
  })
  @IsArray()
  uploadImagesForStory: string[];

  @ApiProperty({ description: 'ID of the ad', example: 1 })
  @IsOptional()
  adId: string;
}
