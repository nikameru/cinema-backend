import { RoomEntity } from "../entities/room.entity";
import { IsNumber, IsString } from "class-validator";

export class RoomDto extends RoomEntity {
    @IsNumber()
    id: number;

    @IsString()
    seats: string;
}
