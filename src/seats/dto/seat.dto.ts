import { SeatEntity } from "../entities/seat.entity";
import { RoomDto } from "../../rooms/dto/room.dto";

export class SeatDto extends SeatEntity {
    id: number;
    room: RoomDto;
}
