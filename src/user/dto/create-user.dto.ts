
import { IsString, IsOptional } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';

export class CreateUserDto {
  @ApiProperty({ description: 'name of the User', example: 'example_string' })
  @IsString()
  name: string;

  @ApiProperty({ description: 'email of the User', example: 'example_string' })
  @IsString()
  email: string;

  @ApiProperty({ description: 'password of the User', example: 'example_string' })
  @IsString()
  password: string;

  @ApiProperty({ description: 'role of the User', example: 'example_value' })
  @IsOptional()
  role: any;

  @ApiProperty({ description: 'business Name', example: 'example_value' })
  @IsOptional()
  businessName: string;

  @ApiProperty({ description: 'address of user', example: 'example_value' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'vat number', example: 'example_value' })
  @IsOptional()
  VatNumber: string;

  @ApiProperty({ description: 'vat number', example: 'example_value' })
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
