import { forwardRef, Module } from "@nestjs/common";
import { SessionsService } from "./sessions.service";
import { SessionsController } from "./sessions.controller";
import { SessionEntity } from "./entities/session.entity";
import { TypeOrmModule } from "@nestjs/typeorm";
import { FilmsModule } from "src/films/films.module";
import { RoomsModule } from "src/rooms/rooms.module";
import { OrdersModule } from "src/orders/orders.module";
import { JwtModule } from "@nestjs/jwt";

@Module({
    imports: [
        TypeOrmModule.forFeature([SessionEntity]),
        FilmsModule,
        RoomsModule,
        forwardRef(() => OrdersModule),
        JwtModule
    ],
    controllers: [SessionsController],
    providers: [SessionsService],
    exports: [SessionsService]
})
export class SessionsModule {}
