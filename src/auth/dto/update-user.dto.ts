import { ApiProperty } from '@nestjs/swagger';
import { Role } from '@prisma/client';
import { IsOptional, IsString, ValidateIf } from 'class-validator';

export class UpdateUserDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsOptional()
  name: string;

  @ApiProperty({ description: 'Business Name', example: 'example_value' })
  @ValidateIf((o) => o.role === Role.TRADER_SELLER)
  @IsOptional()
  businessName: string;

  @ApiProperty({ description: 'address of user', example: 'example_value' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'VAT Number', example: 'example_value' })
  @ValidateIf((o) => o.role === Role.TRADER_SELLER)
  @IsOptional()
  vatNumber: string;

  @ApiProperty({ description: 'Dealer License number', example: 'example_value' })
  @ValidateIf((o) => o.role === Role.TRADER_SELLER)
  @IsOptional()
  dealerLicense: string;

  @ApiProperty({ description: 'profile Image', example: 'example_value' })
  @IsOptional()
  profileImage: string;

  @ApiProperty({ description: 'background Image', example: 'example_value' })
  @IsOptional()
  backgroundImage: string;

  @ApiProperty({ description: 'phone number', example: 'example_value' })
  @IsOptional()
  phoneNumber: string;

}

