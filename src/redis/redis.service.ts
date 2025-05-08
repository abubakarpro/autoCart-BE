import { Inject, Injectable } from '@nestjs/common';
import { RedisClientType } from 'redis';

@Injectable()
export class RedisService {
  constructor(@Inject('REDIS_CLIENT') private readonly client: RedisClientType) {}

  async get(key: string): Promise<string | null> {
    return this.client.get(key);
  }

  async set(key: string, value: any, ttl = 60): Promise<void> {
    await this.client.set(key, JSON.stringify(value), { EX: ttl });
  }

  async del(key: string): Promise<void> {
    await this.client.del(key);
  }

  async scanDel(pattern: string): Promise<void> {
    const keys: string[] = [];
  
    for await (const key of this.client.scanIterator({ MATCH: pattern })) {
      keys.push(key);
    }
    if (keys.length > 0) {
      await this.client.del(keys); 
    }
  }
  
  async clearAdsCache(): Promise<void> {
    const pattern = 'ads:*';
    const keysToDelete: string[] = [];
  
    for await (const key of this.client.scanIterator({ MATCH: pattern })) {
      keysToDelete.push(key);
    }
  
    if (keysToDelete.length > 0) {
      await this.client.del(keysToDelete); 
    }
  }
  
}
