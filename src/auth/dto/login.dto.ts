import { ApiProperty } from '@nestjs/swagger';
import { IsEmail, IsNotEmpty, MinLength } from 'class-validator';

export class LogInDto {
  @ApiProperty({ example: 'johndoe@example.com', description: 'User email address' })
  @IsEmail()
  email: string;

  @ApiProperty({ example: 'StrongPassword123!', description: 'User password', minLength: 6 })
  @IsNotEmpty()
  @MinLength(6)
  password: string;
}
