import { ApiProperty } from '@nestjs/swagger';
import { IsString } from "class-validator";

export class CreateFollowerDto {
  @ApiProperty({ description: 'follower Id', example: 'c5636d76-0524-4283-9196-6def52f3a460' })
  @IsString()
  followerId: string;

  @ApiProperty({ description: 'following Id', example: 'c5636d76-0524-4283-9196-6def52f3a460' })
  @IsString()
  followingId: any;

}