import { createClient } from 'redis';
import dotenv from 'dotenv';

dotenv.config();

const REDIS_PASSWORD = process.env.REDIS_PASSWORD;

if (!REDIS_PASSWORD) {
  throw new Error('REDIS_PASSWORD environment variable is not set');
}

const redisClient = createClient({
  url: `redis://:${encodeURIComponent(REDIS_PASSWORD)}@127.0.0.1:6379`
});

redisClient.on('error', (err) => console.error('Redis Client Error', err));

(async () => {
  try {
    await redisClient.connect();
    console.log('Redis connected successfully!');
  } catch (err) {
    console.error('Error connecting to Redis:', err);
  }
})();

export default redisClient;
