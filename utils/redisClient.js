import pkg from 'redis';
const { createClient } = pkg;

const REDIS_URL = process.env.REDIS_URL || null;

let client = null;
if (REDIS_URL) {
  client = createClient({ url: REDIS_URL });
  client.on('error', (err) => console.error('Redis Client Error', err));
  client.connect().catch(() => {});
}

export function getRedis() {
  return client;
}
