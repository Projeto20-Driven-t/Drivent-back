import { PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import hotelsData from "./hotels";
import { createRooms } from "./rooms";

const prisma = new PrismaClient();

async function createActivitiesSeed() {
  await prisma.activityDate.createMany({
    data: [
      {
        weekDay: 'MONDAY',
        month: 'JANUARY',
        monthDay: 3,
      },
      {
        weekDay: 'TUESDAY',
        month: 'JANUARY',
        monthDay: 4,
      },
    ],
  });

  await prisma.activity.createMany({
    data: [
      {
        name: 'Minecraft: montando o Pc ideal',
        location: 'LATERAL',
        startsAt: 9,
        endsAt: 10,   
        slots: 20,
        dateId: 1,  
      },
      {
        name: 'LoL: montando o Pc ideal',
        location: 'LATERAL',
        startsAt: 10,
        endsAt: 11,   
        slots: 20,
        dateId: 1,  
      },
      {
        name: 'Palestra IA',
        location: 'MAIN',
        startsAt: 9,
        endsAt: 11,   
        slots: 20,
        dateId: 2,  
      },
      {
        name: 'Palestra X',
        location: 'WORKSHOP',
        startsAt: 9,
        endsAt: 10,   
        slots: 20,
        dateId: 2,  
      },
      {
        name: 'Palestra Y',
        location: 'WORKSHOP',
        startsAt: 10,
        endsAt: 11,   
        slots: 20,
        dateId: 2,  
      },
    ],
  });
}

async function createHotelsAndRooms() {
  try {
    await prisma.hotel.createMany({
      data: hotelsData,
    });
    console.log("Hotéis criados com sucesso!");

    const hotelsList = await prisma.hotel.findMany();
    for (const hotel of hotelsList) {
      await createRooms(hotel.id);
    }
    console.log("Quartos criados com sucesso!");
  } catch (error) {
    console.error("Erro ao criar hotéis e quartos:", error);
  }
}

async function createEvent() {
  let event = await prisma.event.findFirst();
  if (!event) {
    event = await prisma.event.create({
      data: {
        title: "Driven.t",
        logoImageUrl: "https://files.driveneducation.com.br/images/logo-rounded.png",
        backgroundImageUrl: "linear-gradient(to right, #FA4098, #FFD77F)",
        startsAt: dayjs().toDate(),
        endsAt: dayjs().add(21, "days").toDate(),
      },
    });
  }
  console.log({ event });
}

async function main() {
  await createEvent();
  await createHotelsAndRooms();
  await createActivitiesSeed();

  await prisma.$disconnect();
}

main().catch((e) => {
  console.error(e);
  process.exit(1);
});