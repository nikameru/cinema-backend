import { RoomEntity } from "../entities/room.entity";
import { IsNumber, ValidateNested } from "class-validator";
import { SessionDto } from "src/sessions/dto/session.dto";

export class RoomDto extends RoomEntity {
    @IsNumber()
    id: number;

    @ValidateNested()
    sessions: SessionDto[];
}
