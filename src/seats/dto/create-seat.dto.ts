import { OmitType } from "@nestjs/mapped-types";
import { SeatDto } from "./seat.dto";

export class CreateSeatDto extends OmitType(SeatDto, ['id' as const]) {}
