import { HttpException, HttpStatus, Injectable } from '@nestjs/common';
import { ConfigService } from '@nestjs/config';
import { JwtService } from '@nestjs/jwt';

import { PrismaService } from '../prisma/prisma.service';
import { RegisterDto } from './dto/register.dto';
import { comparePassword, hashPassword } from '../utils/utility.functions';
import { VerifyService } from '../utils/verify.service';
import { MailerService } from '../mailer/mailer.service';
import { LogInDto } from './dto/login.dto';
import { ResetPasswordDto } from './dto/reset-password.dto';
import { VerifyUserDto } from './dto/verify-user.dto';
import { SendOTPDto } from './dto/send-otp.dto';

@Injectable()
export class AuthService {
  constructor(
    private jwt: JwtService,
    private configService: ConfigService,
    private prismaService: PrismaService,
    private verifyService: VerifyService,
    private mailerService: MailerService,
  ) {}

  async register(registerDto: RegisterDto) {
    try {
      const checkExistingEmail = await this.prismaService.user.findUnique({
        where: { email: registerDto.email.toLowerCase() },
      });

      if (checkExistingEmail) {
        throw new HttpException(
          'This email already exists.',
          HttpStatus.BAD_REQUEST,
        );
      }

      const hashedPassword = await hashPassword(registerDto.password);
      const userCreated = await this.prismaService.user.create({
        data: {
          ...registerDto,
          name: registerDto.name,
          email: registerDto.email.toLowerCase(),
          password: hashedPassword,
          role: registerDto.role ?? 'PRIVATE_SELLER', // Default role if not provided
        },
      });

      if (!userCreated) {
        throw new HttpException('User not created', HttpStatus.BAD_REQUEST);
      }

      // Send OTP for email verification
      const verifyData = await this.verifyService.generateAndStoreOTP(
        userCreated.email,
        userCreated.role,
      );
      await this.mailerService.sendEmail(
        registerDto.email,
        'OTP Verification',
        verifyData.otp,
      );

      return {
        success: true,
        message: 'User created. Verify your account.',
        data: { name: userCreated.name, email: userCreated.email },
      };
    } catch (error) {
      throw error;
    }
  }

  async verifyUser(verifyUserDto: VerifyUserDto) {
    try {
      const { email, code } = verifyUserDto;

      await this.verifyService.verifyOTP(email.toLowerCase(), code);

      const user = await this.prismaService.user.findUnique({
        where: { email: email.toLowerCase() },
        select: {
          id: true,
        },
      });

      if (!user) {
        throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
      }

      const token = await this.generateToken(user.id);
      return {
        success: true,
        message: 'User verified!',
        data: {
          access_token: token,
          id: user.id,
        },
      };
    } catch (error) {
      throw error;
    }
  }

  async login(loginDto: LogInDto) {
    const email = loginDto.email.trim().toLowerCase();
    const password = loginDto.password.trim();

    const user = await this.prismaService.user.findUnique({
      where: { email },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    const isPasswordValid = await comparePassword(password, user.password);
    if (!isPasswordValid) {
      throw new HttpException('Invalid password', HttpStatus.UNAUTHORIZED);
    }

    const token = await this.generateToken(user.id);

    await this.prismaService.user.update({
      where: { id: user.id },
      data: { lastLogin: new Date() },
    });

    return {
      success: true,
      message: 'Login successful',
      data: {
        access_token: token,
        id: user.id,
        name: user.name,
        email: user.email,
        role: user.role,
      },
    };
  }

  async findOneUserByID(userId: string) {
    return await this.prismaService.user.findUnique({
      where: {
        id: userId,
      },
    });
  }

  async generateToken(id: string): Promise<string> {
    if (!id) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    const payload = { id };
    const jwt_secret = this.configService.get<string>('JWT_SECRET');
    const jwt_expiryTime = this.configService.get<number>('JWT_EXPIRY_TIME');

    if (!jwt_secret || !jwt_expiryTime) {
      throw new HttpException(
        'JWT secret or expiry time is missing in environment variables.',
        HttpStatus.BAD_REQUEST,
      );
    }

    return this.jwt.signAsync(payload, {
      expiresIn: jwt_expiryTime,
      secret: jwt_secret,
    });
  }

  async resetPassword(userId: string, resetPasswordDto: ResetPasswordDto) {
    const user = await this.prismaService.user.findUnique({
      where: { id: userId },
    });

    if (!user) {
      throw new HttpException('User not found.', HttpStatus.NOT_FOUND);
    }

    if (resetPasswordDto.newPassword !== resetPasswordDto.confirmNewPassword) {
      throw new HttpException('Passwords do not match', HttpStatus.BAD_REQUEST);
    }

    const isOldPasswordValid = await comparePassword(
      resetPasswordDto.oldPassword,
      user.password,
    );
    if (!isOldPasswordValid) {
      throw new HttpException('Invalid old password', HttpStatus.UNAUTHORIZED);
    }

    const hashedPassword = await hashPassword(resetPasswordDto.newPassword);

    await this.prismaService.user.update({
      where: { id: userId },
      data: { password: hashedPassword },
    });

    return { success: true, message: 'Password updated successfully' };
  }

  async getUserById(userId: string) {
    return this.prismaService.user.findUnique({
      where: { id: userId },
      select: { id: true, name: true, email: true, role: true },
    });
  }

  async sendEmailOTP(sendOtpDto: SendOTPDto) {
    //const isDoctor = await this.doctorService.fin

    const isUser = await this.prismaService.user.findUnique({
      where: {
        email: sendOtpDto.email,
      },
    });

    if (isUser) {
      const verifyData = await this.verifyService.generateAndStoreOTP(
        isUser.email,
        isUser.role,
      );
      const body = `${verifyData.otp}`;
      const sendEmail = await this.mailerService.sendEmail(
        isUser.email,
        'OTP for verification Cricket Tournament',
        body,
      );

      return { message: `Email sent to ${isUser.email}` };
    } else {
      throw new HttpException('User not found', HttpStatus.NOT_FOUND);
    }
  }
}
