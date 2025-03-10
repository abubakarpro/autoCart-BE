import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AdsModule } from './ads/ads.module';
import { CategoryModule } from './category/category.module';
import { FollowerModule } from './follower/follower.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    AdsModule,
    CategoryModule,
    FollowerModule,
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
