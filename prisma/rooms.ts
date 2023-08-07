import { PrismaClient, Room } from "@prisma/client";
import faker from "@faker-js/faker"

const prisma = new PrismaClient();

type CreateRoom = Omit< Room , "id" | "updatedAt" | "createdAt" >;

export async function createRooms (hotelId: number) {
    for (let i = 0; i < 12; i++) {
        await prisma.room.create({
            data: {
                name: faker.commerce.color(),
                capacity: Number(faker.finance.amount(1, 4, 0)),
                hotelId,
            }
        })
    }
}