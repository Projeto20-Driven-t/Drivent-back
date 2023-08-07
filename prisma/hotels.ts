import { Hotel } from "@prisma/client";

type CreateHotel = Omit<Hotel , 'id' |'updatedAt'| 'createdAt' > 

const hotels: CreateHotel[] = [
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
        image: "https://ibb.co/g9GJ2Xy",
    },

]

export default hotels;