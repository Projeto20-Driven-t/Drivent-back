import { prisma } from "@/config";
import { Hotel, Prisma } from "@prisma/client";


async function findHotels() {

  return await prisma.$transaction(async (tx: Prisma.TransactionClient) => {
    const hotels: Hotel[] = await tx.hotel.findMany({})

    const hotelsVacancies = []

    for(let hotel of hotels){
      let roomsWithBookings = await tx.room.findMany({ 
        where:{ hotelId: hotel.id }, 
        include:{Booking: true}
      })

      let totalCapacity = roomsWithBookings.reduce(function (acc, currentValue){
        return acc + currentValue.capacity
      }, 0);

      let bookingsForRoom = roomsWithBookings.map(room => {
        return room.Booking.length
      })
      let totalBookings = bookingsForRoom.reduce(function (acc, currentValue) {
        return acc + currentValue
      }, 0);
      let hotelTotalVancancy = totalCapacity - totalBookings

      hotelsVacancies.push(hotelTotalVancancy)
    }

    const hotelsWithVacancies = []
    for(let i = 0; i < hotels.length; i++){
      hotelsWithVacancies.push({...hotels[i], vacancies: hotelsVacancies[i]})
    }
    return hotelsWithVacancies;
  });

}

async function findRoomsByHotelId(hotelId: number) {
  return prisma.hotel.findFirst({
    where: {
      id: hotelId,
    },
    include: {
      Rooms: true,
    }
  });
}

const hotelRepository = {
  findHotels,
  findRoomsByHotelId,
};

export default hotelRepository;
