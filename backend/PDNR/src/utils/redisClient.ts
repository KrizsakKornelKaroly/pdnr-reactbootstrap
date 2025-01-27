import { createClient, RedisClientType } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;
const REDIS_HOST = process.env.REDIS_HOST || '127.0.0.1';
const REDIS_PORT = process.env.REDIS_PORT || '6379';

if (!REDIS_PASSWORD) {
  throw new Error('REDIS_PASSWORD environment variable is not set');
}

const redisClient: RedisClientType = createClient({
  url: `redis://:${encodeURIComponent(REDIS_PASSWORD)}@${REDIS_HOST}:${REDIS_PORT}`,
  socket: {
    reconnectStrategy: (retries) => {
      if (retries > 10) {
        console.error('Max reconnection attempts reached');
        return new Error('Max reconnection attempts reached');
      }
      return Math.min(retries * 100, 3000); // Exponential backoff with max delay of 3s
    },
  }
});

redisClient.on('error', (err) => console.error('Redis Client Error:', err));
redisClient.on('reconnecting', () => console.log('Redis client reconnecting...'));
redisClient.on('connect', () => console.log('Redis client connected'));

const connectToRedis = async (): Promise<RedisClientType> => {
  try {
    await redisClient.connect();
    return redisClient;
  } catch (err) {
    console.error('Error connecting to Redis:', err);
    throw err;
  }
};

// Initialize connection
connectToRedis().catch((err) => {
  console.error('Failed to establish initial Redis connection:', err);
  process.exit(1); // Exit if initial connection fails
});

export default redisClient;