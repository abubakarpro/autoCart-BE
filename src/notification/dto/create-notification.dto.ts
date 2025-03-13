import { IsString, IsOptional, IsUUID, IsEnum, IsBoolean } from "class-validator";
import { ApiProperty } from '@nestjs/swagger';
import { NotificationType } from '@prisma/client';

export class CreateNotificationDto {
  @ApiProperty({
    description: 'User ID (optional)',
    example: '123e4567-e89b-12d3-a456-426614174000',
    required: false
  })
  @IsUUID()
  @IsOptional()
  userId?: string;

  @ApiProperty({
    description: 'Notification message',
    example: 'Your event has been approved!'
  })
  @IsString()
  content: string;

  @ApiProperty({
    description: 'Notification link',
    example: 'Link of any content'
  })
  @IsString()
  @IsOptional()
  link?: string;

  @ApiProperty({
    description: 'Notification Type',
    enum: NotificationType,
  })
  @IsEnum(NotificationType)
  @IsOptional()
  type?: NotificationType;

  @ApiProperty({
    description: 'Notification isRead status',
  })
  @IsBoolean()
  @IsOptional()
  isRead?: boolean;

  @ApiProperty({
    description: 'Broadcast status',
  })
  @IsBoolean()
  @IsOptional()
  isBroadcast?: boolean;
}
