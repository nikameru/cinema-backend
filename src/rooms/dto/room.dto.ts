import { RoomEntity } from '../entities/room.entity';
import { SeatDto } from '../../seats/dto/seat.dto';

export class RoomDto extends RoomEntity {
    id: number;
    seats: SeatDto[];
}