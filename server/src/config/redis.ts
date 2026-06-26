import Redis from 'ioredis';
import { env } from './env';

let redis: Redis | null = null;
let redisAvailable = false;

try {
  redis = new Redis(env.REDIS_URL, {
    maxRetriesPerRequest: 1,
    retryStrategy(times) {
      if (times > 3) return null; // Stop retrying
      return Math.min(times * 50, 2000);
    },
    lazyConnect: true,
  });

  redis.connect().then(() => {
    redisAvailable = true;
    console.log('✅ Redis connected');
  }).catch(() => {
    console.log('⚠️  Redis not available — caching disabled');
    redisAvailable = false;
  });

  redis.on('error', () => {
    redisAvailable = false;
  });
} catch {
  console.log('⚠️  Redis not available — caching disabled');
}

export default redis;
export { redisAvailable };

// Safe Redis operations that return null if Redis is unavailable
export async function cacheGet(key: string): Promise<string | null> {
  if (!redis || !redisAvailable) return null;
  try { return await redis.get(key); } catch { return null; }
}

export async function cacheSet(key: string, value: string, ttl?: number): Promise<void> {
  if (!redis || !redisAvailable) return;
  try {
    if (ttl) await redis.setex(key, ttl, value);
    else await redis.set(key, value);
  } catch {}
}

export async function cacheDel(key: string): Promise<void> {
  if (!redis || !redisAvailable) return;
  try { await redis.del(key); } catch {}
}

export async function sortedSetIncr(key: string, member: string): Promise<void> {
  if (!redis || !redisAvailable) return;
  try { await redis.zincrby(key, 1, member); } catch {}
}

export async function sortedSetRevRange(key: string, start: number, stop: number): Promise<string[]> {
  if (!redis || !redisAvailable) return [];
  try { return await redis.zrevrange(key, start, stop); } catch { return []; }
}
