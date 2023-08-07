import { Hotel, PrismaClient } from "@prisma/client";
import dayjs from "dayjs";
import hotels from "./hotels";
import { createRooms } from "./rooms";
const prisma = new PrismaClient();

async function main() {
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
type CreateManyHotels = {
  name: string;
  image: string;
}
async function hotelsSeed() {
  for(let hotel of hotels) {
    await prisma.hotel.create({
      data: hotel
    })
  }
}

async function RoomsSeed() {
  const hotels = await prisma.hotel.findMany({});
  if(!hotels) {
    await prisma.hotel.createMany({
      data: [
        {
          name: "Driven Resort",
          image: "https://ibb.co/WDC4D4h",
        },
        {
          name: "Driven Palace",
          image: "https://ibb.co/vQtR9Dd",
        },
        {
          name: "Driven World",
          image: "https://ibb.co/g9GJ2Xy"
        },
      ]
    })
  }
}

main()
hotelsSeed()
async function getHotelsList(): Promise<Hotel[]> {
  return await prisma.hotel.findMany()
}

async function roomsSeed(){
  const hotelsList = await getHotelsList()
  for(let hotel of hotelsList) {
    await createRooms(hotel.id);
  }
}

roomsSeed()

  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
