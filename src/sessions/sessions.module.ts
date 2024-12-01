import { Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { SessionEntity } from "./entities/session.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilmsModule } from "src/films/films.module";
import { RoomsModule } from "src/rooms/rooms.module";
import { OrderEntity } from "src/orders/entities/order.entity";

@Module({
    imports: [
        TypeOrmModule.forFeature([SessionEntity, OrderEntity]),
        FilmsModule,
        RoomsModule
    ],
    controllers: [SessionsController],
    providers: [SessionsService],
    exports: [SessionsService]
})
export class SessionsModule {}
