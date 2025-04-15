import { Module } from '@nestjs/common';
import { JwtModule } from '@nestjs/jwt';

import { AuthService } from './auth.service';
import { AuthController } from './auth.controller';
import { PrismaModule } from '../prisma/prisma.module';
import { MailerModule } from '../mailer/mailer.module';
import { VerifyService } from '../utils/verify.service';
import { JwtStrategy } from './jwt/jwt.strategy';

@Module({
  imports: [PrismaModule, MailerModule, JwtModule],
  controllers: [AuthController],
  providers: [AuthService, VerifyService, JwtStrategy],
})
export class AuthModule {}
