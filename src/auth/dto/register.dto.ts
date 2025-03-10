import { ApiProperty } from '@nestjs/swagger';
import { Role, UserStatus } from '@prisma/client';
import { IsEmail, IsEnum, IsNotEmpty, IsOptional, IsString, MinLength, ValidateIf } from 'class-validator';

export class RegisterDto {
  @ApiProperty({ example: 'John Doe', description: 'Full name of the user' })
  @IsNotEmpty()
  name: string;

  @ApiProperty({ example: 'johndoe@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!', description: 'User password', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;

  @ApiProperty({ example: 'USER', description: 'User role', required: false })
  @IsEnum(Role)
  @IsOptional()
  role?: Role;

  @ApiProperty({ description: 'Business Name', example: 'example_value' })
  @ValidateIf((o) => o.role === Role.TRADER_SELLER)
  @IsNotEmpty()
  businessName: string;

  @ApiProperty({ description: 'address of user', example: 'example_value' })
  @IsString()
  address: string;

  @ApiProperty({ description: 'VAT Number', example: 'example_value' })
  @ValidateIf((o) => o.role === Role.TRADER_SELLER)
  @IsNotEmpty()
  vatNumber: string;

  @ApiProperty({ description: 'Dealer License number', example: 'example_value' })
  @ValidateIf((o) => o.role === Role.TRADER_SELLER)
  @IsNotEmpty()
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

  @ApiProperty({ description: 'Currency of the Price', enum: UserStatus })
  @IsEnum(UserStatus)
  status: UserStatus;
}