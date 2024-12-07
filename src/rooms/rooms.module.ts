import { Module } from "@nestjs/common";
import { RoomsService } from "./rooms.service";
import { RoomsController } from "./rooms.controller";
import { RoomEntity } from "./entities/room.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [TypeOrmModule.forFeature([RoomEntity]), JwtModule],
    controllers: [RoomsController],
    providers: [RoomsService],
    exports: [RoomsService]
})
export class RoomsModule {}
