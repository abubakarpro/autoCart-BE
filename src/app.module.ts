import { Module } from '@nestjs/common';
import { AppController } from './app.controller';
import { AppService } from './app.service';
import { AuthModule } from './auth/auth.module';
import { UserModule } from './user/user.module';
import { ConfigModule } from '@nestjs/config';
import { AdsModule } from './ads/ads.module';
import { CategoryModule } from './category/category.module';
import { FollowerModule } from './follower/follower.module';
import { StoryModule } from './story/story.module';
import { CloudinaryModule } from './cloudinary/cloudinary.module';
import { AdInteractionModule } from './ad-interaction/ad-interaction.module';
import { NotificationModule } from './notification/notification.module';
import { ChatModule } from './chat/chat.module';
import { DashboardAnalyticsModule } from './dashboard-analytics/dashboard-analytics.module';

@Module({
  imports: [
    ConfigModule.forRoot({ isGlobal: true }),
    AuthModule,
    UserModule,
    AdsModule,
    CategoryModule,
    FollowerModule,
    StoryModule,
    CloudinaryModule,
    AdInteractionModule,
    NotificationModule,
    ChatModule,
    DashboardAnalyticsModule
  ],
  controllers: [AppController],
  providers: [AppService],
})
export class AppModule {}
