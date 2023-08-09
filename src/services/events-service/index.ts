import { notFoundError } from "@/errors";
import eventRepository from "@/repositories/event-repository";
import { exclude } from "@/utils/prisma-utils";
import { Event } from "@prisma/client";
import { redis } from "@/config";
import dayjs from "dayjs";
import util from "util";

const redisGetAsync = util.promisify(redis.get).bind(redis);
const redisSetAsync = util.promisify(redis.set).bind(redis);

export type GetFirstEventResult = Omit<Event, "createdAt" | "updatedAt">;

async function getFromCacheOrDatabase(key: string, fetchFromDatabase: ()=> Promise<any>): Promise<any> {
  try {
    const cachedData = await redisGetAsync(key);

    if (cachedData && cachedData!=="[]") {
      return JSON.parse(cachedData);
    } else {
      const dataFromDatabase = await fetchFromDatabase();
      await redisSetAsync(key, JSON.stringify(dataFromDatabase));
      return dataFromDatabase;
    }
  } catch (error) {
    console.error("Erro ao interagir com o Redis:", error);
    return fetchFromDatabase();
  }
}

export async function getFirstEvent(): Promise<GetFirstEventResult> {
  const cacheKey = "firstEvent";

  const event = await getFromCacheOrDatabase(cacheKey, async () => {
    const eventFromDb = await eventRepository.findFirst();
    if (!eventFromDb) throw notFoundError();
    return exclude(eventFromDb, "createdAt", "updatedAt");
  });

  return event;
}

export async function isCurrentEventActive(): Promise<boolean> {
  const cacheKey = "currentEvent";

  try {
    const isActive = await getFromCacheOrDatabase(cacheKey, async () => {
      const event = await eventRepository.findFirst();
      if (!event) return false;

      const now = dayjs();
      const eventStartsAt = dayjs(event.startsAt);
      const eventEndsAt = dayjs(event.endsAt);

      return now.isAfter(eventStartsAt) && now.isBefore(eventEndsAt);
    });

    return isActive;
  } catch (error) {
    throw new Error("Error checking event status");
  }
}

const eventsService = {
  getFirstEvent,
  isCurrentEventActive,
};

export default eventsService;
