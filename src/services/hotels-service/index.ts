import hotelRepository from "@/repositories/hotel-repository";
import enrollmentRepository from "@/repositories/enrollment-repository";
import ticketRepository from "@/repositories/ticket-repository";
import { notFoundError } from "@/errors";
import { cannotListHotelsError } from "@/errors/cannot-list-hotels-error";
import { redis, DEFAULT_EXP } from "@/config";
import util from 'util';

async function listHotels(userId: number) {
  //Tem enrollment?
  const enrollment = await enrollmentRepository.findWithAddressByUserId(userId);
  if (!enrollment) {
    throw notFoundError();
  }
  //Tem ticket pago isOnline false e includesHotel true
  const ticket = await ticketRepository.findTicketByEnrollmentId(enrollment.id);

  if (!ticket || ticket.status === "RESERVED" || ticket.TicketType.isRemote || !ticket.TicketType.includesHotel) {
    throw cannotListHotelsError();
  }
}

const redisGetAsync = util.promisify(redis.get).bind(redis);
const redisSetAsync = util.promisify(redis.set).bind(redis);

async function getHotels(userId: number) {
  const cacheKey = `hotels_user_${userId}`;
 
  // Verifica se os dados estão no cache
  const cachedData = await redisGetAsync(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Se não estiver no cache, busca os dados do banco de dados
  await listHotels(userId);
  const hotels = await hotelRepository.findHotels();

  // Salva os dados no cache para uso futuro
  await redisSetAsync(cacheKey, JSON.stringify(hotels));

  return hotels;
}

async function getHotelsWithRooms(userId: number, hotelId: number) {
  const cacheKey = `hotels_with_rooms_user_${userId}_hotel_${hotelId}`;

  // Verifica se os dados estão no cache
  const cachedData = await redisGetAsync(cacheKey);
  if (cachedData) {
    return JSON.parse(cachedData);
  }

  // Se não estiver no cache, continua com a verificação de listHotels
  await listHotels(userId);

  // Agora busca os dados do banco de dados
  const hotel = await hotelRepository.findRoomsByHotelId(hotelId);

  if (!hotel) {
    throw notFoundError();
  }

  // Salva os dados no cache para uso futuro
  await redisSetAsync(cacheKey, JSON.stringify(hotel), 'EX', DEFAULT_EXP);

  return hotel;
}

const hotelService = {
  getHotels,
  getHotelsWithRooms,
};

export default hotelService;
