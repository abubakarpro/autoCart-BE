import { Injectable, OnModuleInit, OnModuleDestroy } from '@nestjs/common';
import { PrismaClient } from '@prisma/client';

@Injectable()
export class PrismaService extends PrismaClient implements OnModuleInit, OnModuleDestroy {
  async onModuleInit() {
    await this.$connect(); // connect when module initializes
    console.log('Prisma connected');
  }

  async onModuleDestroy() {
    await this.$disconnect(); // cleanly disconnect on shutdown
    console.log('Prisma disconnected');
  }
}