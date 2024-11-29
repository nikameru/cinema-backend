import { IsDateString, IsNumber } from "class-validator";
import { SessionEntity } from "../entities/session.entity";

export class SessionDto extends SessionEntity {
    @IsNumber()
    id: number;

    @IsNumber()
    filmId: number;

    @IsDateString()
    date: Date;

    @IsNumber()
    roomId: number;
}
