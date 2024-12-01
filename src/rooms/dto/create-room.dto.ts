import { OmitType } from "@nestjs/mapped-types";
import { RoomDto } from "./room.dto";

export class CreateRoomDto extends OmitType(RoomDto, [
    "id",
    "sessions"
] as const) {}
