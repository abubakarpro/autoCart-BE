import { IsString } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateCategoryDto {
  @ApiProperty({ description: 'name of the Category', example: 'example_string' })
  @IsString()
  name: string;

  // @ApiProperty({ description: 'Categories for Ads', example: 'example_value' })
  // @IsOptional()
  // ads: any;

}