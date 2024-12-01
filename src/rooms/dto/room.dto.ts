import { RoomEntity } from "../entities/room.entity";
import { SeatDto } from "../../seats/dto/seat.dto";
import { IsArray, IsNumber, ValidateNested } from "class-validator";

export class RoomDto extends RoomEntity {
    @IsNumber()
    id: number;

    @IsArray()
    @ValidateNested({ each: true })
    seats: SeatDto[];
}
