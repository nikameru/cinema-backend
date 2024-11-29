import { Module } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { RoomsController } from "./rooms.controller";
import { RoomEntity } from "./entities/room.entity";
import { TypeOrmModule } from "@nestjs/typeorm";

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity])],
    controllers: [RoomsController],
    providers: [RoomsService]
})
export class RoomsModule {}
