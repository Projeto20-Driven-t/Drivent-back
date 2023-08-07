import Redis from 'ioredis';

export const DEFAULT_EXP = 3600; //seconds

export const redis = new Redis(process.env.REDIS_URL);

(async () => {
  console.log("connecting redis...");
})();
