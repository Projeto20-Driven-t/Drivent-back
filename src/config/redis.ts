import Redis from 'ioredis';

export const DEFAULT_EXP = 60; // seconds

export const redis = new Redis(process.env.REDIS_URL);

(async () => {
  console.log("connecting redis...");
  // O ioredis conecta automaticamente, então não é necessário chamar o método connect().
})();
