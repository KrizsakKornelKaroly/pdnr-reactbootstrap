import * as redis from 'redis';
const client = redis.createClient();

client.on('error', (err) => {
  console.log(`Redis Error: ${err}`);
});

module.exports = client;

export async function storeResetToken(userId: string, token: string) {
  await client.setEx(`reset_token:${token}`, 3600, userId); // Expires in 1 hour
}