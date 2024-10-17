import client from './redisClient';  // Import the Redis client
import { generateResetToken } from './createToken';

export const storeResetToken = async (userEmail: string): Promise<string> => {
  const resetToken = generateResetToken();
  const expiration = 900; // 15 minutes in seconds

  // Store token in Redis
  await client.setEx(`password_reset:${resetToken}`, expiration, userEmail);

  return resetToken;
};
