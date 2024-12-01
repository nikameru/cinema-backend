import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { SessionEntity } from "./entities/session.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { RoomEntity } from "src/rooms/entities/room.entity";
import { FilmEntity } from "src/films/entities/film.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([SessionEntity, FilmEntity, RoomEntity])
    ],
    controllers: [SessionsController],
    providers: [SessionsService]
})
export class SessionsModule {}
